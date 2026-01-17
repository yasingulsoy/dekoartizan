const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const getStorage = (slug, fileIndex = 0) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      if (!slug) {
        return cb(new Error('Slug gerekli'));
      }
      
      const productDir = path.join(uploadsDir, slug);
      
      if (!fs.existsSync(productDir)) {
        fs.mkdirSync(productDir, { recursive: true });
      }
      
      cb(null, productDir);
    },
    filename: (req, file, cb) => {
      // İlk resim slug ile aynı, diğerleri slug-1, slug-2 şeklinde
      const ext = path.extname(file.originalname);
      const fileName = fileIndex === 0 ? `${slug}${ext}` : `${slug}-${fileIndex}${ext}`;
      cb(null, fileName);
    }
  });
};

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

const createUploadMiddleware = (slug, maxFiles = 5) => {
  // Her dosya için farklı index ile storage oluştur
  // Bu yaklaşım çalışmayacak, multer'ın kendi mekanizmasını kullanmalıyız
  // Bunun yerine products.js'te dosya adını manuel olarak ayarlayacağız
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        if (!slug) {
          return cb(new Error('Slug gerekli'));
        }
        
        const productDir = path.join(uploadsDir, slug);
        
        if (!fs.existsSync(productDir)) {
          fs.mkdirSync(productDir, { recursive: true });
        }
        
        cb(null, productDir);
      },
      filename: (req, file, cb) => {
        // Dosya adı products.js'te ayarlanacak
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `temp-${uniqueSuffix}${ext}`);
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
      files: maxFiles
    },
    fileFilter: fileFilter
  });
};

const deleteProductFolder = (slug) => {
  if (!slug) return;
  
  const productDir = path.join(uploadsDir, slug);
  
  if (fs.existsSync(productDir)) {
    fs.rmSync(productDir, { recursive: true, force: true });
  }
};

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

const createUpdateImageMiddleware = (slug, oldFileName) => {
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        if (!slug) {
          return cb(new Error('Slug gerekli'));
        }
        
        const productDir = path.join(uploadsDir, slug);
        
        if (!fs.existsSync(productDir)) {
          fs.mkdirSync(productDir, { recursive: true });
        }
        
        cb(null, productDir);
      },
      filename: (req, file, cb) => {
        // Geçici dosya adı oluştur, products.js'te düzeltilecek
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `temp-update-${uniqueSuffix}${ext}`);
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
