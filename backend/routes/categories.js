const express = require('express');
const router = express.Router();
const { Category, SubCategory } = require('../models');
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
    const { include_inactive } = req.query;
    const where = {};
    if (include_inactive !== 'true') {
      where.is_active = true;
    }
    
    const categories = await Category.findAll({
      where,
      include: [
        {
          model: SubCategory,
          as: 'subCategories',
          required: false,
          where: include_inactive !== 'true' ? { is_active: true } : undefined
        }
      ],
      order: [['display_order', 'ASC']]
    });
    
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Kategori listesi hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: SubCategory,
          as: 'subCategories',
          required: false
        }
      ]
    });
    
    if (!category) {
      return res.status(404).json({ success: false, error: 'Kategori bulunamadı' });
    }
    
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Kategori getirme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, image_url, icon, display_order, is_active, meta_title, meta_description, meta_keywords } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'Kategori adı gerekli' });
    }
    
    const slug = createSlug(name);
    
    const existingCategory = await Category.findOne({ where: { slug } });
    if (existingCategory) {
      return res.status(400).json({ success: false, error: 'Bu slug zaten kullanılıyor' });
    }
    
    const category = await Category.create({
      name,
      slug,
      description,
      image_url,
      icon,
      display_order: display_order || 0,
      is_active: is_active !== undefined ? is_active : true,
      meta_title,
      meta_description,
      meta_keywords
    });
    
    res.json({ success: true, data: category, message: 'Kategori oluşturuldu' });
  } catch (error) {
    console.error('Kategori oluşturma hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Kategori bulunamadı' });
    }
    
    const updateData = { ...req.body };
    
    if (updateData.name && updateData.name !== category.name) {
      updateData.slug = createSlug(updateData.name);
      
      const existingCategory = await Category.findOne({ 
        where: { slug: updateData.slug, id: { [Op.ne]: category.id } }
      });
      if (existingCategory) {
        return res.status(400).json({ success: false, error: 'Bu slug zaten kullanılıyor' });
      }
    }
    
    await category.update(updateData);
    
    res.json({ success: true, data: category, message: 'Kategori güncellendi' });
  } catch (error) {
    console.error('Kategori güncelleme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Kategori bulunamadı' });
    }
    
    await category.destroy();
    
    res.json({ success: true, message: 'Kategori silindi' });
  } catch (error) {
    console.error('Kategori silme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:categoryId/sub-categories', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Kategori bulunamadı' });
    }
    
    const { name, description, image_url, icon, display_order, is_active, meta_title, meta_description, meta_keywords } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'Alt kategori adı gerekli' });
    }
    
    const slug = createSlug(name);
    
    const existingSubCategory = await SubCategory.findOne({ where: { slug } });
    if (existingSubCategory) {
      return res.status(400).json({ success: false, error: 'Bu slug zaten kullanılıyor' });
    }
    
    const subCategory = await SubCategory.create({
      category_id: category.id,
      name,
      slug,
      description,
      image_url,
      icon,
      display_order: display_order || 0,
      is_active: is_active !== undefined ? is_active : true,
      meta_title,
      meta_description,
      meta_keywords
    });
    
    res.json({ success: true, data: subCategory, message: 'Alt kategori oluşturuldu' });
  } catch (error) {
    console.error('Alt kategori oluşturma hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/sub-categories/:id', async (req, res) => {
  try {
    const subCategory = await SubCategory.findByPk(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ success: false, error: 'Alt kategori bulunamadı' });
    }
    
    const updateData = { ...req.body };
    
    if (updateData.name && updateData.name !== subCategory.name) {
      updateData.slug = createSlug(updateData.name);
      
      const existingSubCategory = await SubCategory.findOne({ 
        where: { slug: updateData.slug, id: { [Op.ne]: subCategory.id } }
      });
      if (existingSubCategory) {
        return res.status(400).json({ success: false, error: 'Bu slug zaten kullanılıyor' });
      }
    }
    
    await subCategory.update(updateData);
    
    res.json({ success: true, data: subCategory, message: 'Alt kategori güncellendi' });
  } catch (error) {
    console.error('Alt kategori güncelleme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/sub-categories/:id', async (req, res) => {
  try {
    const subCategory = await SubCategory.findByPk(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ success: false, error: 'Alt kategori bulunamadı' });
    }
    
    await subCategory.destroy();
    
    res.json({ success: true, message: 'Alt kategori silindi' });
  } catch (error) {
    console.error('Alt kategori silme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
