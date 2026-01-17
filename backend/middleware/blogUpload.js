const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads/blogs');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const getStorage = (blogId) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      if (!blogId) {
        return cb(new Error('Blog ID gerekli'));
      }
      
      const blogDir = path.join(uploadsDir, blogId.toString());
      
      if (!fs.existsSync(blogDir)) {
        fs.mkdirSync(blogDir, { recursive: true });
      }
      
      cb(null, blogDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      const cleanName = name.replace(/[^a-zA-Z0-9-_]/g, '_');
      cb(null, `image_${uniqueSuffix}${ext}`);
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

const createBlogUploadMiddleware = (blogId) => {
  return multer({
    storage: getStorage(blogId),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: fileFilter
  });
};

const deleteBlogFolder = (blogId) => {
  if (!blogId) return;
  
  const blogDir = path.join(uploadsDir, blogId.toString());
  
  if (fs.existsSync(blogDir)) {
    fs.rmSync(blogDir, { recursive: true, force: true });
  }
};

module.exports = {
  createBlogUploadMiddleware,
  deleteBlogFolder,
  uploadsDir
};
