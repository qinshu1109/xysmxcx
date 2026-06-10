const express = require('express');
const bcrypt = require('bcryptjs');
const { query, getOne } = require('../config/db');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { signUserToken } = require('../middlewares/auth');

const router = express.Router();

function publicUser(row) {
  return {
    id: row.id,
    username: row.username,
    nickname: row.nickname,
    avatar: row.avatar
  };
}

router.post('/register', asyncHandler(async (req, res) => {
  const { username, nickname, password, confirmPassword } = req.body;
  const cleanUsername = String(username || '').trim();
  const cleanNickname = String(nickname || '').trim();

  if (!cleanUsername || !cleanNickname || !password || !confirmPassword) {
    throw new AppError('用户名、昵称和密码不能为空');
  }
  if (cleanUsername.length > 50 || cleanNickname.length > 50) {
    throw new AppError('用户名或昵称过长');
  }
  if (String(password).length < 6) {
    throw new AppError('密码至少 6 位');
  }
  if (password !== confirmPassword) {
    throw new AppError('两次输入的密码不一致');
  }

  const existing = await getOne('SELECT id FROM users WHERE username = ?', [cleanUsername]);
  if (existing) {
    throw new AppError('用户名已存在');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const avatar = req.body.avatar || '/static/mine/mine_default_user_avatar.png';
  const result = await query(
    'INSERT INTO users (username, password_hash, nickname, avatar) VALUES (?, ?, ?, ?)',
    [cleanUsername, passwordHash, cleanNickname, avatar]
  );
  const user = await getOne(
    'SELECT id, username, nickname, avatar FROM users WHERE id = ?',
    [result.insertId]
  );

  sendSuccess(res, { token: signUserToken(user), user: publicUser(user) });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const cleanUsername = String(username || '').trim();
  if (!cleanUsername || !password) {
    throw new AppError('用户名和密码不能为空');
  }

  const user = await getOne(
    'SELECT id, username, password_hash, nickname, avatar FROM users WHERE username = ?',
    [cleanUsername]
  );
  if (!user) {
    throw new AppError('用户名或密码错误', 400, 400);
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    throw new AppError('用户名或密码错误', 400, 400);
  }

  sendSuccess(res, { token: signUserToken(user), user: publicUser(user) });
}));

module.exports = router;
