require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('node:path');
const { sendSuccess } = require('./utils/response');
const { errorHandler } = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const catRoutes = require('./routes/cats');
const helpPostRoutes = require('./routes/helpPosts');
const commentRoutes = require('./routes/comments');
const meRoutes = require('./routes/me');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');

function createApp() {
  const app = express();
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  const uploadDir = process.env.UPLOAD_DIR || 'uploads';

  app.use(cors({ origin: corsOrigin === '*' ? true : corsOrigin }));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/uploads', express.static(path.resolve(__dirname, '..', uploadDir)));

  app.get('/api/health', (req, res) => {
    sendSuccess(res, { status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/home', homeRoutes);
  app.use('/api/cats', catRoutes);
  app.use('/api/help-posts', helpPostRoutes);
  app.use('/api/comments', commentRoutes);
  app.use('/api/me', meRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/admin', adminRoutes);

  app.use((req, res) => {
    res.status(404).json({ code: 404, message: '接口不存在', data: null });
  });

  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
