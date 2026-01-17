const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { createBlogUploadMiddleware, deleteBlogFolder } = require('../middleware/blogUpload');
const { Blog, User } = require('../models');
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

// Tüm blogları listele
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, is_published, locale, search } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (is_published !== undefined) where.is_published = is_published === 'true';
    if (locale) where.locale = locale;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { excerpt: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const { count, rows } = await Blog.findAndCountAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] }
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
    console.error('Blog listesi hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tek bir blog getir
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] }
      ]
    });
    
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog bulunamadı' });
    }
    
    res.json({ success: true, data: blog });
  } catch (error) {
    console.error('Blog getirme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Slug ile blog getir
router.get('/slug/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({
      where: { slug: req.params.slug },
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] }
      ]
    });
    
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog bulunamadı' });
    }
    
    // View count artır
    blog.view_count += 1;
    await blog.save();
    
    res.json({ success: true, data: blog });
  } catch (error) {
    console.error('Blog getirme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Yeni blog oluştur
router.post('/', async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      tags,
      is_published,
      published_at,
      meta_title,
      meta_description,
      locale,
      author_ids,
      author_id
    } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Başlık ve içerik gerekli' });
    }
    
    let slug = createSlug(title);
    
    // Slug benzersizliğini kontrol et
    let existingBlog = await Blog.findOne({ where: { slug } });
    let counter = 1;
    while (existingBlog) {
      slug = `${createSlug(title)}-${counter}`;
      existingBlog = await Blog.findOne({ where: { slug } });
      counter++;
    }
    
    const blogData = {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      tags: tags && Array.isArray(tags) ? tags : [],
      is_published: is_published === true || is_published === 'true',
      published_at: is_published === true || is_published === 'true' 
        ? (published_at || new Date()) 
        : null,
      meta_title: meta_title || title,
      meta_description: meta_description || excerpt || null,
      locale: locale || 'tr',
      author_ids: author_ids && Array.isArray(author_ids) ? author_ids : [],
      author_id: author_id || null,
      view_count: 0
    };
    
    const blog = await Blog.create(blogData);
    
    res.json({
      success: true,
      data: blog,
      message: 'Blog oluşturuldu. Şimdi resim yükleyebilirsiniz.'
    });
  } catch (error) {
    console.error('Blog oluşturma hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Blog resmi yükle
router.post('/:id/image', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog bulunamadı' });
    }
    
    const upload = createBlogUploadMiddleware(blog.id);
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'Resim yüklenmedi' });
      }
      
      try {
        const imageUrl = `/uploads/blogs/${blog.id}/${req.file.filename}`;
        
        blog.image = imageUrl;
        await blog.save();
        
        res.json({
          success: true,
          data: { image: imageUrl },
          message: 'Resim başarıyla yüklendi'
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

// Blog güncelle
router.put('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog bulunamadı' });
    }
    
    const updateData = { ...req.body };
    
    // Eğer başlık değiştiyse slug'ı güncelle
    if (updateData.title && updateData.title !== blog.title) {
      let newSlug = createSlug(updateData.title);
      
      // Slug benzersizliğini kontrol et (kendi ID'si hariç)
      let existingBlog = await Blog.findOne({ 
        where: { slug: newSlug, id: { [Op.ne]: blog.id } } 
      });
      let counter = 1;
      while (existingBlog) {
        newSlug = `${createSlug(updateData.title)}-${counter}`;
        existingBlog = await Blog.findOne({ 
          where: { slug: newSlug, id: { [Op.ne]: blog.id } } 
        });
        counter++;
      }
      
      updateData.slug = newSlug;
    }
    
    // Eğer yayınlanıyorsa ve published_at yoksa ekle
    if (updateData.is_published === true && !blog.published_at) {
      updateData.published_at = new Date();
    }
    
    // Eğer yayından kaldırılıyorsa published_at'i temizle
    if (updateData.is_published === false) {
      updateData.published_at = null;
    }
    
    await blog.update(updateData);
    
    res.json({ success: true, data: blog, message: 'Blog güncellendi' });
  } catch (error) {
    console.error('Blog güncelleme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Blog sil
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog bulunamadı' });
    }
    
    // Blog klasörünü sil
    deleteBlogFolder(blog.id);
    
    await blog.destroy();
    
    res.json({ success: true, message: 'Blog ve tüm resimleri silindi' });
  } catch (error) {
    console.error('Blog silme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
