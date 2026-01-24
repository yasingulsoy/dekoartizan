const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const { authenticateAdmin } = require('../middleware/auth');

// Uploads klasörünün tam yolu
const uploadsBaseDir = path.join(__dirname, '../uploads');

// Dosya listesi getir
router.get('/list', authenticateAdmin, async (req, res) => {
  try {
    const { folder = '' } = req.query;
    
    // Geçersiz karakterleri temizle ve normalize et
    const cleanFolder = String(folder).replace(/[<>:"|?*\x00-\x1f]/g, '').trim();
    const targetPath = cleanFolder ? path.join(uploadsBaseDir, cleanFolder) : uploadsBaseDir;
    
    // Güvenlik: uploadsBaseDir dışına çıkışı engelle
    const normalizedPath = path.normalize(targetPath);
    if (!normalizedPath.startsWith(path.normalize(uploadsBaseDir))) {
      return res.status(403).json({ success: false, error: 'Yetkisiz erişim' });
    }

    // Klasörün var olup olmadığını kontrol et
    let stats;
    try {
      stats = await fs.stat(targetPath);
      if (!stats.isDirectory()) {
        // Klasör değilse boş liste döndür
        return res.json({
          success: true,
          data: {
            items: [],
            currentPath: cleanFolder || '/',
            basePath: '/',
          },
        });
      }
    } catch (error) {
      // Klasör yoksa boş liste döndür
      return res.json({
        success: true,
        data: {
          items: [],
          currentPath: cleanFolder || '/',
          basePath: '/',
        },
      });
    }

    const items = [];
    const entries = await fs.readdir(targetPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(targetPath, entry.name);
      const relativePath = path.relative(uploadsBaseDir, fullPath);
      
      try {
        const stats = await fs.stat(fullPath);
        items.push({
          name: entry.name,
          type: entry.isDirectory() ? 'directory' : 'file',
          size: entry.isDirectory() ? null : stats.size,
          modified: stats.mtime,
          path: relativePath.replace(/\\/g, '/'), // Windows için path normalize
        });
      } catch (error) {
        // Dosya erişim hatası varsa atla
        continue;
      }
    }

    // Klasörleri önce, sonra dosyaları göster
    items.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    res.json({
      success: true,
      data: {
        items,
        currentPath: cleanFolder || '/',
        basePath: '/',
      },
    });
  } catch (error) {
    console.error('Dosya listesi hatası:', error);
    // Hata durumunda da boş liste döndür (404 yerine)
    res.json({
      success: true,
      data: {
        items: [],
        currentPath: req.query.folder || '/',
        basePath: '/',
      },
    });
  }
});

// Dosya/klasör sil
router.delete('/delete', authenticateAdmin, async (req, res) => {
  try {
    const { path: filePath } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ success: false, error: 'Dosya yolu gerekli' });
    }

    const targetPath = path.join(uploadsBaseDir, filePath);
    
    // Güvenlik: uploadsBaseDir dışına çıkışı engelle
    const normalizedPath = path.normalize(targetPath);
    if (!normalizedPath.startsWith(path.normalize(uploadsBaseDir))) {
      return res.status(403).json({ success: false, error: 'Yetkisiz erişim' });
    }

    const stats = await fs.stat(targetPath);
    
    if (stats.isDirectory()) {
      // Klasör silme (recursive)
      await fs.rm(targetPath, { recursive: true, force: true });
      res.json({ success: true, message: 'Klasör silindi' });
    } else {
      // Dosya silme
      await fs.unlink(targetPath);
      res.json({ success: true, message: 'Dosya silindi' });
    }
  } catch (error) {
    console.error('Dosya silme hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Dosya silinemedi',
    });
  }
});

// Klasör oluştur
router.post('/mkdir', authenticateAdmin, async (req, res) => {
  try {
    const { path: folderPath, name } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'Klasör adı gerekli' });
    }

    const basePath = folderPath ? path.join(uploadsBaseDir, folderPath) : uploadsBaseDir;
    const newFolderPath = path.join(basePath, name);
    
    // Güvenlik: uploadsBaseDir dışına çıkışı engelle
    const normalizedPath = path.normalize(newFolderPath);
    if (!normalizedPath.startsWith(path.normalize(uploadsBaseDir))) {
      return res.status(403).json({ success: false, error: 'Yetkisiz erişim' });
    }

    await fs.mkdir(newFolderPath, { recursive: true });
    
    res.json({
      success: true,
      message: 'Klasör oluşturuldu',
      data: {
        path: path.relative(uploadsBaseDir, newFolderPath).replace(/\\/g, '/'),
      },
    });
  } catch (error) {
    console.error('Klasör oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Klasör oluşturulamadı',
    });
  }
});

// Dosya boyutu formatla
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

module.exports = router;
