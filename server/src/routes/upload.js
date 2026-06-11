const express = require('express');
const { authenticateUserOrAdmin } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');
const { sendSuccess } = require('../utils/response');
const { AppError } = require('../utils/AppError');

const router = express.Router();

router.post('/', authenticateUserOrAdmin, upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('请选择要上传的图片');
    }
    sendSuccess(res, { url: `/uploads/${req.file.filename}` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
