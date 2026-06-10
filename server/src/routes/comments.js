const express = require('express');
const { query, getOne } = require('../config/db');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { authenticateUser } = require('../middlewares/auth');
const { parsePagination, paged } = require('../utils/pagination');

const router = express.Router();
const TARGET_TYPES = ['cat', 'help_post'];

async function assertTargetExists(targetType, targetId) {
  if (targetType === 'cat') {
    const cat = await getOne('SELECT id FROM cats WHERE id = ?', [targetId]);
    if (!cat) throw new AppError('评论对象不存在', 404, 404);
    return;
  }
  const post = await getOne('SELECT id FROM help_posts WHERE id = ?', [targetId]);
  if (!post) throw new AppError('评论对象不存在', 404, 404);
}

router.get('/', asyncHandler(async (req, res) => {
  const targetType = String(req.query.targetType || '').trim();
  const targetId = Number(req.query.targetId);
  if (!TARGET_TYPES.includes(targetType) || !targetId) {
    throw new AppError('targetType 和 targetId 必填');
  }

  const { page, pageSize, offset } = parsePagination(req.query);
  const totalRow = await getOne(
    'SELECT COUNT(*) AS total FROM comments WHERE target_type = ? AND target_id = ?',
    [targetType, targetId]
  );
  const rows = await query(
    `SELECT c.id, c.target_type AS targetType, c.target_id AS targetId, c.content,
     c.created_at AS createdAt, u.id AS userId, u.nickname AS userNickname, u.avatar AS userAvatar
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.target_type = ? AND c.target_id = ?
     ORDER BY c.created_at DESC, c.id DESC
     LIMIT ? OFFSET ?`,
    [targetType, targetId, pageSize, offset]
  );

  sendSuccess(res, paged(rows, totalRow.total, page, pageSize));
}));

router.post('/', authenticateUser, asyncHandler(async (req, res) => {
  const targetType = String(req.body.targetType || '').trim();
  const targetId = Number(req.body.targetId);
  const content = String(req.body.content || '').trim();

  if (!TARGET_TYPES.includes(targetType) || !targetId) {
    throw new AppError('评论对象参数不合法');
  }
  if (!content) {
    throw new AppError('评论内容不能为空');
  }
  if (content.length > 300) {
    throw new AppError('评论最多 300 字');
  }

  await assertTargetExists(targetType, targetId);
  const result = await query(
    'INSERT INTO comments (target_type, target_id, user_id, content) VALUES (?, ?, ?, ?)',
    [targetType, targetId, req.user.id, content]
  );
  const comment = await getOne(
    `SELECT c.id, c.target_type AS targetType, c.target_id AS targetId, c.content,
     c.created_at AS createdAt, u.id AS userId, u.nickname AS userNickname, u.avatar AS userAvatar
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.id = ?`,
    [result.insertId]
  );

  sendSuccess(res, comment, '评论成功');
}));

module.exports = router;
