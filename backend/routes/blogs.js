const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { createBlogUploadMiddleware, createBlogWallUploadMiddleware, deleteBlogFolder, deleteBlogWallFolder } = require('../middleware/blogUpload');
const { Blog, User } = require('../models');
const { Op } = require('sequelize');
const { blogsWallDir } = require('../middleware/blogUpload');
const {
  normalizeBlogHtml,
  persistInlineImagesToBlogsWall,
  cleanupUnreferencedContentImages,
} = require('../utils/blogContent');

const resolveUploadPath = (urlPath) => {
  if (!urlPath || typeof urlPath !== 'string') return null;
  // blog.image gibi alanlar genelde "/uploads/..." başlar; path.join bunu "absolute" sayıp base'i yok sayabilir.
  const clean = urlPath.replace(/^\/+/, '');
  return path.join(__dirname, '..', clean);
};

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
        { 
          model: User, 
          as: 'author', 
          attributes: ['id', 'name', 'email'],
          required: false
        }
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
        { 
          model: User, 
          as: 'author', 
          attributes: ['id', 'name', 'email'],
          required: false
        }
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
        { 
          model: User, 
          as: 'author', 
          attributes: ['id', 'name', 'email'],
          required: false
        }
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

    const normalizedContent = normalizeBlogHtml(content);
    
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
      content: normalizedContent,
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

    // İçerikte base64 gömülü görseller varsa dosyaya yazıp src'leri URL ile değiştir
    try {
      const persisted = persistInlineImagesToBlogsWall({
        html: blog.content,
        blogId: blog.id,
        blogsWallDir,
      });

      if (persisted.html !== blog.content) {
        await blog.update({ content: persisted.html });
      }

      // İlk kayıt sonrası gereksiz content_* dosyası varsa temizle (best-effort)
      cleanupUnreferencedContentImages({ html: blog.content, blogId: blog.id, blogsWallDir });
    } catch (e) {
      console.error('İçerik görsel dönüştürme hatası (create):', e);
      // Blog kaydını tamamen başarısız yapmıyoruz; kullanıcı tekrar güncelleyebilir.
    }
    
    res.json({
      success: true,
      data: blog,
      message: 'Blog oluşturuldu.'
    });
  } catch (error) {
    console.error('Blog oluşturma hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Blog resmi yükle (blogsWall/{blogId}/ klasörüne kaydeder)
router.post('/:id/image', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog bulunamadı' });
    }
    
    // Eski resmi sil
    if (blog.image) {
      const oldImagePath = resolveUploadPath(blog.image);
      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
          console.log('Eski blog resmi silindi:', oldImagePath);
        } catch (error) {
          console.error('Eski resim silme hatası:', error);
        }
      }
    }
    
    // blogsWall/{blogId}/ klasörüne kaydet
    const upload = createBlogWallUploadMiddleware(blog.id);
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'Resim yüklenmedi' });
      }
      
      try {
        const imageUrl = `/uploads/blogsWall/${blog.id}/${req.file.filename}`;
        
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

// Blog kapak resmini sil
router.delete('/:id/image', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog bulunamadı' });
    }

    if (!blog.image) {
      return res.json({
        success: true,
        data: { image: null },
        message: 'Blog kapağı zaten boş'
      });
    }

    const imagePath = resolveUploadPath(blog.image);
    if (imagePath && fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
        console.log('Blog kapak resmi silindi:', imagePath);
      } catch (error) {
        console.error('Kapak resmi silme hatası:', error);
      }
    }

    blog.image = null;
    await blog.save();

    return res.json({
      success: true,
      data: { image: null },
      message: 'Blog kapağı silindi'
    });
  } catch (error) {
    console.error('Kapak resmi silme hatası:', error);
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

    // İçerik normalize + base64 img -> dosya
    if (updateData.content !== undefined && updateData.content !== null) {
      const normalized = normalizeBlogHtml(updateData.content);
      const persisted = persistInlineImagesToBlogsWall({
        html: normalized,
        blogId: blog.id,
        blogsWallDir,
      });
      updateData.content = persisted.html;
    }
    
    // Eğer resim alanı boş/null gönderilirse eski resmi sil
    if (updateData.image === null || updateData.image === '' || updateData.image === undefined) {
      if (blog.image) {
        const oldImagePath = resolveUploadPath(blog.image);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log('Blog resmi silindi:', oldImagePath);
          } catch (error) {
            console.error('Resim silme hatası:', error);
          }
        }
        updateData.image = null;
      }
    }
    
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

    // Güncelleme sonrası içerikte referans edilmeyen content_* dosyalarını temizle
    if (updateData.content !== undefined) {
      cleanupUnreferencedContentImages({ html: blog.content, blogId: blog.id, blogsWallDir });
    }
    
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
    
    // Blog klasörlerini sil
    deleteBlogFolder(blog.id); // Eski içerik klasörü
    deleteBlogWallFolder(blog.id); // Kapak resmi klasörü
    
    await blog.destroy();
    
    res.json({ success: true, message: 'Blog ve tüm resimleri silindi' });
  } catch (error) {
    console.error('Blog silme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
