const fs = require('node:fs');
const path = require('node:path');
const multer = require('multer');
const { AppError } = require('../utils/AppError');

function getUploadDir() {
  return path.resolve(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads');
}

function ensureUploadDir() {
  fs.mkdirSync(getUploadDir(), { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    ensureUploadDir();
    cb(null, getUploadDir());
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeExt = ext && ext.length <= 10 ? ext : '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return cb(new AppError('只允许上传图片文件'));
    }
    return cb(null, true);
  }
});

module.exports = { upload, ensureUploadDir, getUploadDir };
