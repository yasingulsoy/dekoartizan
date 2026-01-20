const express = require('express');
const router = express.Router();
const path = require('path');
const { PaperType } = require('../models');
const { Op } = require('sequelize');
const { upload, deletePaperTypeImage } = require('../middleware/paperTypeUpload');

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

// Tüm kağıt türlerini listele
router.get('/', async (req, res) => {
  try {
    const { include_inactive } = req.query;
    const where = {};
    if (include_inactive !== 'true') {
      where.is_active = true;
    }
    
    const paperTypes = await PaperType.findAll({
      where,
      order: [['display_order', 'ASC'], ['created_at', 'DESC']]
    });
    
    res.json({ success: true, data: paperTypes });
  } catch (error) {
    console.error('Kağıt türü listesi hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tek bir kağıt türünü getir
router.get('/:id', async (req, res) => {
  try {
    const paperType = await PaperType.findByPk(req.params.id);
    
    if (!paperType) {
      return res.status(404).json({ success: false, error: 'Kağıt türü bulunamadı' });
    }
    
    res.json({ success: true, data: paperType });
  } catch (error) {
    console.error('Kağıt türü getirme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Yeni kağıt türü oluştur (resim ile)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price, price_per_m2, description, is_active, display_order } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'Kağıt türü adı gerekli' });
    }
    
    if (!price || !price_per_m2) {
      return res.status(400).json({ success: false, error: 'Fiyat bilgileri gerekli' });
    }
    
    const slug = createSlug(name);
    
    const existingPaperType = await PaperType.findOne({ where: { slug } });
    if (existingPaperType) {
      return res.status(400).json({ success: false, error: 'Bu slug zaten kullanılıyor' });
    }
    
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/PaperType/${req.file.filename}`;
    }
    
    // Description JSON array olarak parse et
    let descriptionArray = [];
    if (description) {
      try {
        descriptionArray = typeof description === 'string' ? JSON.parse(description) : description;
      } catch (e) {
        // Eğer JSON değilse, string olarak kabul et ve array'e çevir
        descriptionArray = [description];
      }
    }
    
    const paperType = await PaperType.create({
      name,
      slug,
      price: parseFloat(price),
      price_per_m2: parseFloat(price_per_m2),
      description: descriptionArray,
      image_url: imageUrl,
      is_active: is_active !== undefined ? is_active === 'true' || is_active === true : true,
      display_order: display_order ? parseInt(display_order) : 0
    });
    
    res.json({ success: true, data: paperType, message: 'Kağıt türü oluşturuldu' });
  } catch (error) {
    console.error('Kağıt türü oluşturma hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Kağıt türünü güncelle
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const paperType = await PaperType.findByPk(req.params.id);
    
    if (!paperType) {
      return res.status(404).json({ success: false, error: 'Kağıt türü bulunamadı' });
    }
    
    const { name, price, price_per_m2, description, is_active, display_order } = req.body;
    
    // Slug kontrolü (eğer isim değiştiyse)
    let slug = paperType.slug;
    if (name && name !== paperType.name) {
      slug = createSlug(name);
      const existingPaperType = await PaperType.findOne({ 
        where: { slug, id: { [Op.ne]: req.params.id } } 
      });
      if (existingPaperType) {
        return res.status(400).json({ success: false, error: 'Bu slug zaten kullanılıyor' });
      }
    }
    
    // Eski resmi sil (yeni resim yükleniyorsa veya resim kaldırılmak isteniyorsa)
    let imageUrl = paperType.image_url;
    
    // Eğer yeni resim yükleniyorsa
    if (req.file) {
      // Eski resmi sil
      if (paperType.image_url) {
        try {
          deletePaperTypeImage(paperType.image_url);
        } catch (error) {
          console.error('Eski resim silinirken hata:', error);
        }
      }
      imageUrl = `/uploads/PaperType/${req.file.filename}`;
    }
    // Eğer resim kaldırılmak isteniyorsa (remove_image parametresi varsa)
    else if (req.body.remove_image === 'true' || req.body.remove_image === true) {
      if (paperType.image_url) {
        try {
          deletePaperTypeImage(paperType.image_url);
        } catch (error) {
          console.error('Resim silinirken hata:', error);
        }
      }
      imageUrl = null;
    }
    
    // Description JSON array olarak parse et
    let descriptionArray = paperType.description;
    if (description !== undefined) {
      try {
        descriptionArray = typeof description === 'string' ? JSON.parse(description) : description;
      } catch (e) {
        descriptionArray = [description];
      }
    }
    
    await paperType.update({
      name: name || paperType.name,
      slug,
      price: price !== undefined ? parseFloat(price) : paperType.price,
      price_per_m2: price_per_m2 !== undefined ? parseFloat(price_per_m2) : paperType.price_per_m2,
      description: descriptionArray,
      image_url: imageUrl,
      is_active: is_active !== undefined ? is_active === 'true' || is_active === true : paperType.is_active,
      display_order: display_order !== undefined ? parseInt(display_order) : paperType.display_order
    });
    
    res.json({ success: true, data: paperType, message: 'Kağıt türü güncellendi' });
  } catch (error) {
    console.error('Kağıt türü güncelleme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Kağıt türünü sil
router.delete('/:id', async (req, res) => {
  try {
    const paperType = await PaperType.findByPk(req.params.id);
    
    if (!paperType) {
      return res.status(404).json({ success: false, error: 'Kağıt türü bulunamadı' });
    }
    
    // Resmi sil (varsa)
    if (paperType.image_url) {
      try {
        deletePaperTypeImage(paperType.image_url);
      } catch (error) {
        console.error('Resim silinirken hata:', error);
        // Resim silme hatası olsa bile kaydı silmeye devam et
      }
    }
    
    await paperType.destroy();
    
    res.json({ success: true, message: 'Kağıt türü silindi' });
  } catch (error) {
    console.error('Kağıt türü silme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
