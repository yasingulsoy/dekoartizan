const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads/PaperType');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const cleanName = name.replace(/[^a-zA-Z0-9-_]/g, '_');
    cb(null, `paper-type-${cleanName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

const deletePaperTypeImage = (imageUrl) => {
  if (!imageUrl) return;
  
  try {
    // URL'den dosya adını çıkar
    const fileName = path.basename(imageUrl);
    const filePath = path.join(uploadsDir, fileName);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Kağıt türü resmi silindi: ${filePath}`);
    } else {
      console.warn(`Resim dosyası bulunamadı: ${filePath}`);
    }
  } catch (error) {
    console.error(`Resim silme hatası: ${error.message}`);
    throw error;
  }
};

module.exports = {
  upload,
  uploadsDir,
  deletePaperTypeImage
};
