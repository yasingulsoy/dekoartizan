const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { createUploadMiddleware, createUpdateImageMiddleware, deleteProductFolder, uploadsDir } = require('../middleware/upload');
const { Product, ProductImage, Category, SubCategory } = require('../models');
const { Op } = require('sequelize');

const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, is_active, is_archived, category_id, search } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (is_active !== undefined) where.is_active = is_active === 'true';
    if (is_archived !== undefined) where.is_archived = is_archived === 'true';
    if (category_id) where.category_id = category_id;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { sku: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category' },
        { model: SubCategory, as: 'subCategory' },
        { model: ProductImage, as: 'images' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Ürün listesi hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: SubCategory, as: 'subCategory' },
        { model: ProductImage, as: 'images', order: [['display_order', 'ASC']] }
      ]
    });
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Ürün getirme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      name,
      sku,
      category_id,
      sub_category_id,
      short_description,
      description,
      price,
      discount_price,
      discount_percentage,
      stock_quantity,
      min_order_quantity,
      max_order_quantity,
      weight,
      dimensions,
      is_featured,
      is_new,
      is_on_sale,
      meta_title,
      meta_description,
      meta_keywords
    } = req.body;
    
    if (!sku) {
      return res.status(400).json({ success: false, error: 'SKU gerekli' });
    }
    
    const existingProduct = await Product.findOne({ where: { sku } });
    if (existingProduct) {
      return res.status(400).json({ success: false, error: 'Bu SKU zaten kullanılıyor' });
    }
    
    const slug = createSlug(name || sku);
    
    const product = await Product.create({
      name,
      slug,
      sku,
      category_id: category_id || null,
      sub_category_id: sub_category_id || null,
      short_description,
      description,
      price: parseFloat(price),
      discount_price: discount_price ? parseFloat(discount_price) : null,
      discount_percentage: discount_percentage ? parseInt(discount_percentage) : 0,
      stock_quantity: stock_quantity ? parseInt(stock_quantity) : 0,
      min_order_quantity: min_order_quantity ? parseInt(min_order_quantity) : 1,
      max_order_quantity: max_order_quantity ? parseInt(max_order_quantity) : null,
      weight: weight ? parseFloat(weight) : null,
      dimensions,
      is_featured: is_featured === 'true' || is_featured === true,
      is_new: is_new === 'true' || is_new === true,
      is_on_sale: is_on_sale === 'true' || is_on_sale === true,
      meta_title,
      meta_description,
      meta_keywords,
      is_active: true,
      is_archived: false
    });
    
    res.json({
      success: true,
      data: product,
      message: 'Ürün oluşturuldu. Şimdi resimleri yükleyebilirsiniz.'
    });
  } catch (error) {
    console.error('Ürün oluşturma hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/images', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });
    }
    
    if (!product.sku) {
      return res.status(400).json({ success: false, error: 'Ürün SKU\'su bulunamadı' });
    }
    
    const upload = createUploadMiddleware(product.sku, 5);
    upload.array('images', 5)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, error: 'Resim yüklenmedi' });
      }
      
      try {
        const images = [];
        let primarySet = false;
        
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          const imageUrl = `/uploads/products/${product.sku.replace(/[^a-zA-Z0-9-_]/g, '_')}/${file.filename}`;
          
          const image = await ProductImage.create({
            product_id: product.id,
            image_url: imageUrl,
            file_name: file.filename,
            file_path: file.path,
            file_size: file.size,
            mime_type: file.mimetype,
            display_order: i,
            is_primary: i === 0 && !primarySet
          });
          
          if (i === 0 && !primarySet) {
            primarySet = true;
            product.main_image_url = imageUrl;
            await product.save();
          }
          
          images.push(image);
        }
        
        res.json({
          success: true,
          data: images,
          message: `${images.length} resim başarıyla yüklendi`
        });
      } catch (error) {
        console.error('Resim kaydetme hatası:', error);
        res.status(500).json({ success: false, error: error.message });
      }
    });
  } catch (error) {
    console.error('Resim yükleme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });
    }
    
    const updateData = { ...req.body };
    
    if (updateData.name && updateData.name !== product.name) {
      updateData.slug = createSlug(updateData.name);
    }
    
    if (updateData.sku && updateData.sku !== product.sku) {
      const oldSku = product.sku;
      const newSku = updateData.sku;
      
      const oldDir = path.join(uploadsDir, oldSku.replace(/[^a-zA-Z0-9-_]/g, '_'));
      const newDir = path.join(uploadsDir, newSku.replace(/[^a-zA-Z0-9-_]/g, '_'));
      
      if (fs.existsSync(oldDir)) {
        fs.renameSync(oldDir, newDir);
        
        const images = await ProductImage.findAll({ where: { product_id: product.id } });
        for (const image of images) {
          image.image_url = image.image_url.replace(
            `/uploads/products/${oldSku.replace(/[^a-zA-Z0-9-_]/g, '_')}/`,
            `/uploads/products/${newSku.replace(/[^a-zA-Z0-9-_]/g, '_')}/`
          );
          await image.save();
        }
      }
    }
    
    await product.update(updateData);
    
    res.json({ success: true, data: product, message: 'Ürün güncellendi' });
  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/:id/archive', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });
    }
    
    const { is_archived } = req.body;
    product.is_archived = is_archived === true || is_archived === 'true';
    await product.save();
    
    res.json({
      success: true,
      data: product,
      message: product.is_archived ? 'Ürün arşivlendi' : 'Ürün yayına alındı'
    });
  } catch (error) {
    console.error('Arşivleme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });
    }
    
    const { is_active } = req.body;
    product.is_active = is_active === true || is_active === 'true';
    await product.save();
    
    res.json({
      success: true,
      data: product,
      message: product.is_active ? 'Ürün yayına alındı' : 'Ürün pasif yapıldı'
    });
  } catch (error) {
    console.error('Durum güncelleme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id/images/:imageId', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });
    }
    
    const image = await ProductImage.findByPk(req.params.imageId);
    if (!image || image.product_id !== parseInt(req.params.id)) {
      return res.status(404).json({ success: false, error: 'Resim bulunamadı' });
    }
    
    if (!product.sku) {
      return res.status(400).json({ success: false, error: 'Ürün SKU\'su bulunamadı' });
    }
    
    const oldFileName = path.basename(image.file_path);
    const oldFilePath = image.file_path;
    
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
    
    const upload = createUpdateImageMiddleware(product.sku, oldFileName);
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'Resim yüklenmedi' });
      }
      
      try {
        const cleanSku = product.sku.replace(/[^a-zA-Z0-9-_]/g, '_');
        const imageUrl = `/uploads/products/${cleanSku}/${req.file.filename}`;
        
        // Resim bilgilerini güncelle
        await image.update({
          image_url: imageUrl,
          file_name: req.file.filename,
          file_path: req.file.path,
          file_size: req.file.size,
          mime_type: req.file.mimetype
        });
        
        if (image.is_primary) {
          product.main_image_url = imageUrl;
          await product.save();
        }
        
        res.json({
          success: true,
          data: image,
          message: 'Resim güncellendi'
        });
      } catch (error) {
        console.error('Resim güncelleme hatası:', error);
        res.status(500).json({ success: false, error: error.message });
      }
    });
  } catch (error) {
    console.error('Resim güncelleme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id/images/:imageId', async (req, res) => {
  try {
    const image = await ProductImage.findByPk(req.params.imageId);
    if (!image || image.product_id !== parseInt(req.params.id)) {
      return res.status(404).json({ success: false, error: 'Resim bulunamadı' });
    }
    
    if (fs.existsSync(image.file_path)) {
      fs.unlinkSync(image.file_path);
    }
    
    await image.destroy();
    
    res.json({ success: true, message: 'Resim silindi' });
  } catch (error) {
    console.error('Resim silme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });
    }
    
    if (product.sku) {
      const images = await ProductImage.findAll({ where: { product_id: product.id } });
      for (const image of images) {
        if (fs.existsSync(image.file_path)) {
          fs.unlinkSync(image.file_path);
        }
      }
      
      deleteProductFolder(product.sku);
    }
    
    await product.destroy();
    
    res.json({ success: true, message: 'Ürün ve tüm resimleri silindi' });
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
