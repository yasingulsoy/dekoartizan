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
        { 
          model: ProductImage, 
          as: 'images',
          separate: true,
          order: [['display_order', 'ASC']]
        }
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
    
    if (!product.slug) {
      return res.status(400).json({ success: false, error: 'Ürün slug\'ı bulunamadı' });
    }
    
    const upload = createUploadMiddleware(product.slug, 5);
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
          const ext = path.extname(file.filename);
          
          // Dosya adını slug ile eşleştir: ilk resim slug, diğerleri slug-1, slug-2...
          const fileName = i === 0 ? `${product.slug}${ext}` : `${product.slug}-${i}${ext}`;
          const newFilePath = path.join(path.dirname(file.path), fileName);
          
          // Dosyayı yeniden adlandır
          if (file.path !== newFilePath) {
            fs.renameSync(file.path, newFilePath);
          }
          
          // Göreceli yol oluştur
          const imageUrl = `/uploads/products/${product.slug}/${fileName}`;
          const relativePath = `uploads/products/${product.slug}/${fileName}`;
          
          const image = await ProductImage.create({
            product_id: product.id,
            image_url: imageUrl,
            file_name: fileName,
            file_path: relativePath, // Göreceli yol kaydet
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
    let oldSlug = product.slug;
    let newSlug = product.slug;
    
    // Boş string'leri null'a çevir (integer alanlar için)
    if (updateData.max_order_quantity === '' || updateData.max_order_quantity === null) {
      updateData.max_order_quantity = null;
    } else if (updateData.max_order_quantity !== undefined) {
      updateData.max_order_quantity = parseInt(updateData.max_order_quantity);
    }
    
    if (updateData.category_id === '' || updateData.category_id === null) {
      updateData.category_id = null;
    } else if (updateData.category_id !== undefined) {
      updateData.category_id = parseInt(updateData.category_id);
    }
    
    if (updateData.sub_category_id === '' || updateData.sub_category_id === null) {
      updateData.sub_category_id = null;
    } else if (updateData.sub_category_id !== undefined) {
      updateData.sub_category_id = parseInt(updateData.sub_category_id);
    }
    
    // Sayısal alanları parse et
    if (updateData.price !== undefined) updateData.price = parseFloat(updateData.price);
    if (updateData.discount_price !== undefined && updateData.discount_price !== '' && updateData.discount_price !== null) {
      updateData.discount_price = parseFloat(updateData.discount_price);
    } else if (updateData.discount_price === '' || updateData.discount_price === null) {
      updateData.discount_price = null;
    }
    if (updateData.discount_percentage !== undefined) updateData.discount_percentage = parseInt(updateData.discount_percentage) || 0;
    if (updateData.stock_quantity !== undefined) updateData.stock_quantity = parseInt(updateData.stock_quantity) || 0;
    if (updateData.min_order_quantity !== undefined) updateData.min_order_quantity = parseInt(updateData.min_order_quantity) || 1;
    if (updateData.weight !== undefined && updateData.weight !== '' && updateData.weight !== null) {
      updateData.weight = parseFloat(updateData.weight);
    } else if (updateData.weight === '' || updateData.weight === null) {
      updateData.weight = null;
    }
    
    if (updateData.name && updateData.name !== product.name) {
      newSlug = createSlug(updateData.name);
      updateData.slug = newSlug;
    }
    
    // Slug değiştiyse klasörü ve resim yollarını güncelle
    if (newSlug !== oldSlug) {
      const oldDir = path.join(uploadsDir, oldSlug);
      const newDir = path.join(uploadsDir, newSlug);
      
      if (fs.existsSync(oldDir)) {
        fs.renameSync(oldDir, newDir);
        
        const images = await ProductImage.findAll({ where: { product_id: product.id } });
        for (const image of images) {
          const oldImageUrl = image.image_url;
          const newImageUrl = oldImageUrl.replace(
            `/uploads/products/${oldSlug}/`,
            `/uploads/products/${newSlug}/`
          );
          const newFilePath = image.file_path.replace(
            `uploads/products/${oldSlug}/`,
            `uploads/products/${newSlug}/`
          );
          
          await image.update({
            image_url: newImageUrl,
            file_path: newFilePath
          });
        }
        
        // Ana resim URL'ini de güncelle
        if (product.main_image_url) {
          updateData.main_image_url = product.main_image_url.replace(
            `/uploads/products/${oldSlug}/`,
            `/uploads/products/${newSlug}/`
          );
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
    
    if (!product.slug) {
      return res.status(400).json({ success: false, error: 'Ürün slug\'ı bulunamadı' });
    }
    
    const oldFileName = path.basename(image.file_path);
    // Eski dosyanın tam yolunu oluştur
    const oldFilePath = path.join(__dirname, '..', image.file_path);
    
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
    
    // Dosya adını koru, sadece uzantıyı güncelle
    const ext = path.extname(oldFileName);
    const baseName = path.basename(oldFileName, ext);
    
    const upload = createUpdateImageMiddleware(product.slug, oldFileName);
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'Resim yüklenmedi' });
      }
      
      try {
        // Yeni dosyanın uzantısını al
        const newExt = path.extname(req.file.filename);
        // Dosya adını koru, uzantıyı güncelle
        const finalFileName = `${baseName}${newExt}`;
        const finalFilePath = path.join(path.dirname(req.file.path), finalFileName);
        
        // Dosyayı yeniden adlandır
        if (req.file.path !== finalFilePath) {
          fs.renameSync(req.file.path, finalFilePath);
        }
        
        const imageUrl = `/uploads/products/${product.slug}/${finalFileName}`;
        const relativePath = `uploads/products/${product.slug}/${finalFileName}`;
        
        // Resim bilgilerini güncelle
        await image.update({
          image_url: imageUrl,
          file_name: finalFileName,
          file_path: relativePath, // Göreceli yol kaydet
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
    
    // Göreceli yoldan tam yolu oluştur
    const fullPath = path.join(__dirname, '..', image.file_path);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
    
    await image.destroy();
    
    res.json({ success: true, message: 'Resim silindi' });
  } catch (error) {
    console.error('Resim silme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Resim sıralamasını güncelle
router.patch('/:id/images/reorder', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });
    }
    
    const { imageIds } = req.body; // [1, 3, 2, 4] gibi sıralı ID'ler
    
    if (!Array.isArray(imageIds)) {
      return res.status(400).json({ success: false, error: 'imageIds bir dizi olmalıdır' });
    }
    
    // Tüm resimlerin bu ürüne ait olduğunu kontrol et
    const images = await ProductImage.findAll({
      where: { product_id: product.id }
    });
    
    const imageIdsSet = new Set(imageIds);
    const existingIdsSet = new Set(images.map(img => img.id));
    
    // Tüm ID'lerin mevcut olduğunu ve ürüne ait olduğunu kontrol et
    for (const id of imageIds) {
      if (!existingIdsSet.has(id)) {
        return res.status(400).json({ 
          success: false, 
          error: `ID ${id} bu ürüne ait değil` 
        });
      }
    }
    
    // Sıralamayı güncelle
    for (let i = 0; i < imageIds.length; i++) {
      const imageId = imageIds[i];
      await ProductImage.update(
        { display_order: i },
        { where: { id: imageId, product_id: product.id } }
      );
    }
    
    // İlk resmi ana resim yap
    if (imageIds.length > 0) {
      const firstImageId = imageIds[0];
      const firstImage = await ProductImage.findByPk(firstImageId);
      
      // Önceki ana resmi kaldır
      await ProductImage.update(
        { is_primary: false },
        { where: { product_id: product.id, is_primary: true } }
      );
      
      // Yeni ana resmi ayarla
      await ProductImage.update(
        { is_primary: true },
        { where: { id: firstImageId, product_id: product.id } }
      );
      
      // Ürünün main_image_url'ini güncelle
      if (firstImage) {
        product.main_image_url = firstImage.image_url;
        await product.save();
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Resim sıralaması güncellendi' 
    });
  } catch (error) {
    console.error('Resim sıralama hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });
    }
    
    if (product.slug) {
      const images = await ProductImage.findAll({ where: { product_id: product.id } });
      for (const image of images) {
        // Göreceli yoldan tam yolu oluştur
        const fullPath = path.join(__dirname, '..', image.file_path);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
      
      deleteProductFolder(product.slug);
    }
    
    await product.destroy();
    
    res.json({ success: true, message: 'Ürün ve tüm resimleri silindi' });
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
