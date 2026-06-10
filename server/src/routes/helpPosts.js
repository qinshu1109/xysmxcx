const express = require('express');
const { query, getOne, withTransaction } = require('../config/db');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { authenticateUser } = require('../middlewares/auth');
const { parsePagination, paged } = require('../utils/pagination');
const { maskPhone } = require('../utils/phone');
const { splitImages } = require('../utils/rows');

const router = express.Router();
const HELP_TYPES = ['help', 'adoption', 'feeding', 'neuter', 'injury', 'other'];
const HELP_STATUS = ['pending', 'processing', 'done'];

function buildHelpWhere(queryParams, extra = {}) {
  const conditions = ['1 = 1'];
  const params = [];

  if (queryParams.keyword) {
    conditions.push('(hp.title LIKE ? OR hp.location LIKE ? OR hp.description LIKE ?)');
    const keyword = `%${queryParams.keyword}%`;
    params.push(keyword, keyword, keyword);
  }
  if (queryParams.type) {
    conditions.push('hp.type = ?');
    params.push(queryParams.type);
  }
  if (queryParams.status) {
    conditions.push('hp.status = ?');
    params.push(queryParams.status);
  }
  if (extra.userId) {
    conditions.push('hp.user_id = ?');
    params.push(extra.userId);
  }

  return { where: conditions.join(' AND '), params };
}

async function attachImages(posts) {
  if (posts.length === 0) return posts;
  const ids = posts.map((post) => post.id);
  const placeholders = ids.map(() => '?').join(',');
  const imageRows = await query(
    `SELECT post_id AS postId, image_url AS imageUrl
     FROM help_post_images
     WHERE post_id IN (${placeholders})
     ORDER BY sort_order ASC, id ASC`,
    ids
  );
  const imageMap = imageRows.reduce((acc, row) => {
    if (!acc[row.postId]) acc[row.postId] = [];
    acc[row.postId].push(row.imageUrl);
    return acc;
  }, {});
  return posts.map((post) => ({ ...post, images: imageMap[post.id] || [] }));
}

function validateHelpBody(body, options = {}) {
  const title = String(body.title || '').trim();
  const type = String(body.type || '').trim();
  const description = String(body.description || '').trim();
  const location = String(body.location || '').trim();
  const contactPhone = String(body.contactPhone || body.contact_phone || '').trim();
  const status = body.status ? String(body.status).trim() : options.defaultStatus || 'pending';
  const images = Array.isArray(body.images) ? body.images.filter(Boolean).slice(0, 3) : [];

  if (!title || !type || !description || !location || !contactPhone) {
    throw new AppError('标题、类型、描述、地点和联系方式不能为空');
  }
  if (title.length > 10) {
    throw new AppError('标题最多 10 个字');
  }
  if (description.length > 200) {
    throw new AppError('描述最多 200 个字');
  }
  if (!HELP_TYPES.includes(type)) {
    throw new AppError('求助类型不合法');
  }
  if (!HELP_STATUS.includes(status)) {
    throw new AppError('状态不合法');
  }
  if (Array.isArray(body.images) && body.images.length > 3) {
    throw new AppError('图片最多 3 张');
  }

  return { title, type, description, location, contactPhone, status, images };
}

router.get('/', asyncHandler(async (req, res) => {
  const { page, pageSize, offset } = parsePagination(req.query);
  const { where, params } = buildHelpWhere(req.query);
  const totalRow = await getOne(
    `SELECT COUNT(*) AS total FROM help_posts hp WHERE ${where}`,
    params
  );
  const rows = await query(
    `SELECT hp.id, hp.title, hp.type, hp.description, hp.location, hp.status,
     hp.created_at AS createdAt, hp.updated_at AS updatedAt,
     u.id AS userId, u.nickname AS userNickname, u.avatar AS userAvatar
     FROM help_posts hp
     JOIN users u ON u.id = hp.user_id
     WHERE ${where}
     ORDER BY hp.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );

  sendSuccess(res, paged(await attachImages(rows), totalRow.total, page, pageSize));
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const post = await getOne(
    `SELECT hp.id, hp.title, hp.type, hp.description, hp.location, hp.contact_phone AS contactPhone,
     hp.status, hp.created_at AS createdAt, hp.updated_at AS updatedAt,
     u.id AS userId, u.nickname AS userNickname, u.avatar AS userAvatar
     FROM help_posts hp
     JOIN users u ON u.id = hp.user_id
     WHERE hp.id = ?`,
    [req.params.id]
  );
  if (!post) {
    throw new AppError('求助领养信息不存在', 404, 404);
  }

  const [images, commentStats] = await Promise.all([
    query(
      'SELECT image_url AS imageUrl FROM help_post_images WHERE post_id = ? ORDER BY sort_order ASC, id ASC',
      [req.params.id]
    ),
    getOne(
      "SELECT COUNT(*) AS commentCount FROM comments WHERE target_type = 'help_post' AND target_id = ?",
      [req.params.id]
    )
  ]);

  sendSuccess(res, {
    ...post,
    contactPhoneMasked: maskPhone(post.contactPhone),
    contactPhone: undefined,
    images: images.map((row) => row.imageUrl),
    stats: {
      commentCount: commentStats.commentCount
    }
  });
}));

router.post('/', authenticateUser, asyncHandler(async (req, res) => {
  const body = validateHelpBody(req.body);
  const result = await withTransaction(async (connection) => {
    const [insertResult] = await connection.execute(
      `INSERT INTO help_posts (title, type, description, location, contact_phone, user_id, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [body.title, body.type, body.description, body.location, body.contactPhone, req.user.id]
    );

    for (const [index, imageUrl] of body.images.entries()) {
      await connection.execute(
        'INSERT INTO help_post_images (post_id, image_url, sort_order) VALUES (?, ?, ?)',
        [insertResult.insertId, imageUrl, index + 1]
      );
    }
    return insertResult;
  });

  const created = await getOne('SELECT id, title, type, status, created_at AS createdAt FROM help_posts WHERE id = ?', [result.insertId]);
  sendSuccess(res, created, '发布成功');
}));

router.validateHelpBody = validateHelpBody;
router.attachImages = attachImages;
router.buildHelpWhere = buildHelpWhere;

module.exports = router;
