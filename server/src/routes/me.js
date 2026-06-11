const express = require('express');
const { query, getOne } = require('../config/db');
const { asyncHandler } = require('../utils/asyncHandler');
const { authenticateUser } = require('../middlewares/auth');
const { sendSuccess } = require('../utils/response');
const { AppError } = require('../utils/AppError');
const { parsePagination, paged, buildLimitOffset } = require('../utils/pagination');
const helpPostRoutes = require('./helpPosts');

const router = express.Router();

router.use(authenticateUser);

router.get('/profile', asyncHandler(async (req, res) => {
  const user = await getOne(
    'SELECT id, username, nickname, avatar, role FROM users WHERE id = ?',
    [req.user.id]
  );
  if (!user) {
    throw new AppError('用户不存在', 404, 404);
  }
  sendSuccess(res, {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    avatar: user.avatar,
    role: user.role || 'user'
  });
}));

router.get('/help-posts', asyncHandler(async (req, res) => {
  const { page, pageSize, offset } = parsePagination(req.query);
  const { where, params } = helpPostRoutes.buildHelpWhere(req.query, { userId: req.user.id });
  const totalRow = await getOne(
    `SELECT COUNT(*) AS total FROM help_posts hp WHERE ${where}`,
    params
  );
  const limitOffset = buildLimitOffset(pageSize, offset);
  const rows = await query(
    `SELECT hp.id, hp.title, hp.type, hp.description, hp.location, hp.status,
     hp.created_at AS createdAt, hp.updated_at AS updatedAt
     FROM help_posts hp
     WHERE ${where}
     ORDER BY hp.created_at DESC
     ${limitOffset}`,
    params
  );

  sendSuccess(res, paged(await helpPostRoutes.attachImages(rows), totalRow.total, page, pageSize));
}));

router.get('/comments', asyncHandler(async (req, res) => {
  const { page, pageSize, offset } = parsePagination(req.query);
  const totalRow = await getOne(
    'SELECT COUNT(*) AS total FROM comments WHERE user_id = ?',
    [req.user.id]
  );
  const limitOffset = buildLimitOffset(pageSize, offset);
  const rows = await query(
    `SELECT c.id, c.target_type AS targetType, c.target_id AS targetId, c.content,
     c.created_at AS createdAt,
     CASE WHEN c.target_type = 'cat' THEN cats.name ELSE hp.title END AS targetTitle
     FROM comments c
     LEFT JOIN cats ON c.target_type = 'cat' AND cats.id = c.target_id
     LEFT JOIN help_posts hp ON c.target_type = 'help_post' AND hp.id = c.target_id
     WHERE c.user_id = ?
     ORDER BY c.created_at DESC, c.id DESC
     ${limitOffset}`,
    [req.user.id]
  );

  sendSuccess(res, paged(rows, totalRow.total, page, pageSize));
}));

router.delete('/comments/:id', asyncHandler(async (req, res) => {
  const result = await query(
    'DELETE FROM comments WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );
  if (result.affectedRows === 0) {
    throw new AppError('评论不存在或无权删除', 404, 404);
  }
  sendSuccess(res, { id: Number(req.params.id) }, '删除成功');
}));

module.exports = router;
