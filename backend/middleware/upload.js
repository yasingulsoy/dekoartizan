const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Uploads klasörünü oluştur
const uploadsDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// SKU'ya göre dinamik klasör oluşturma
const getStorage = (sku) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      if (!sku) {
        return cb(new Error('SKU gerekli'));
      }
      
      // SKU'yu temizle (özel karakterleri kaldır)
      const cleanSku = sku.replace(/[^a-zA-Z0-9-_]/g, '_');
      const productDir = path.join(uploadsDir, cleanSku);
      
      // Klasör yoksa oluştur
      if (!fs.existsSync(productDir)) {
        fs.mkdirSync(productDir, { recursive: true });
      }
      
      cb(null, productDir);
    },
    filename: (req, file, cb) => {
      // Orijinal dosya adını koru ama benzersiz yap
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      const cleanName = name.replace(/[^a-zA-Z0-9-_]/g, '_');
      cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
    }
  });
};

// Dosya filtresi
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyaları yüklenebilir (jpeg, jpg, png, webp, gif)'));
  }
};

// SKU'ya göre upload middleware oluştur
const createUploadMiddleware = (sku, maxFiles = 5) => {
  return multer({
    storage: getStorage(sku),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
      files: maxFiles
    },
    fileFilter: fileFilter
  });
};

// Klasör silme fonksiyonu
const deleteProductFolder = (sku) => {
  if (!sku) return;
  
  const cleanSku = sku.replace(/[^a-zA-Z0-9-_]/g, '_');
  const productDir = path.join(uploadsDir, cleanSku);
  
  if (fs.existsSync(productDir)) {
    fs.rmSync(productDir, { recursive: true, force: true });
  }
};

// Tek dosya yükleme için (ürün güncelleme)
const uploadSingle = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      const cleanName = name.replace(/[^a-zA-Z0-9-_]/g, '_');
      cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Resim güncelleme için - aynı klasöre kaydet
const createUpdateImageMiddleware = (sku, oldFileName) => {
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        if (!sku) {
          return cb(new Error('SKU gerekli'));
        }
        
        const cleanSku = sku.replace(/[^a-zA-Z0-9-_]/g, '_');
        const productDir = path.join(uploadsDir, cleanSku);
        
        if (!fs.existsSync(productDir)) {
          fs.mkdirSync(productDir, { recursive: true });
        }
        
        cb(null, productDir);
      },
      filename: (req, file, cb) => {
        // Eski dosya adını kullan (aynı isimle kaydet)
        if (oldFileName) {
          cb(null, oldFileName);
        } else {
          // Eğer eski dosya adı yoksa yeni oluştur
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext);
          const cleanName = name.replace(/[^a-zA-Z0-9-_]/g, '_');
          cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
        }
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: fileFilter
  });
};

module.exports = {
  createUploadMiddleware,
  createUpdateImageMiddleware,
  deleteProductFolder,
  uploadSingle,
  uploadsDir
};
