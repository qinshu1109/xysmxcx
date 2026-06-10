const express = require('express');
const bcrypt = require('bcryptjs');
const { query, getOne, withTransaction } = require('../config/db');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { authenticateAdmin, signAdminToken } = require('../middlewares/auth');
const { parsePagination, paged, buildLimitOffset } = require('../utils/pagination');
const { boolFields, boolRows } = require('../utils/rows');
const helpPostRoutes = require('./helpPosts');

const router = express.Router();
const GENDERS = ['male', 'female', 'unknown'];
const HELP_STATUS = ['pending', 'processing', 'done'];
const USER_ROLES = ['user', 'admin'];

function numberFlag(value) {
  return value === true || value === 1 || value === '1' ? 1 : 0;
}

function parseCatBody(body) {
  const name = String(body.name || '').trim();
  const imageUrl = String(body.imageUrl || body.image_url || '').trim();
  const gender = String(body.gender || '').trim();
  const location = String(body.location || '').trim();
  const healthStatus = String(body.healthStatus || body.health_status || '').trim();

  if (!name || !imageUrl || !gender || !location || !healthStatus) {
    throw new AppError('猫咪名称、照片、性别、地点和健康状态不能为空');
  }
  if (!GENDERS.includes(gender)) {
    throw new AppError('猫咪性别不合法');
  }

  return {
    name,
    imageUrl,
    gender,
    age: body.age || null,
    color: body.color || null,
    personality: body.personality || null,
    location,
    healthStatus,
    isNeutered: numberFlag(body.isNeutered ?? body.is_neutered),
    isAdoptable: numberFlag(body.isAdoptable ?? body.is_adoptable),
    needsAttention: numberFlag(body.needsAttention ?? body.needs_attention),
    remark: body.remark || null
  };
}

async function deleteHelpPost(connection, id) {
  await connection.execute("DELETE FROM comments WHERE target_type = 'help_post' AND target_id = ?", [id]);
  await connection.execute('DELETE FROM help_post_images WHERE post_id = ?', [id]);
  const [result] = await connection.execute('DELETE FROM help_posts WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new AppError('求助领养信息不存在', 404, 404);
  }
}

async function deleteCat(connection, id) {
  await connection.execute("DELETE FROM comments WHERE target_type = 'cat' AND target_id = ?", [id]);
  const [result] = await connection.execute('DELETE FROM cats WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new AppError('猫咪不存在', 404, 404);
  }
}

async function deleteUser(connection, id) {
  const [posts] = await connection.execute('SELECT id FROM help_posts WHERE user_id = ?', [id]);
  for (const post of posts) {
    await deleteHelpPost(connection, post.id);
  }
  await connection.execute('DELETE FROM comments WHERE user_id = ?', [id]);
  const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new AppError('用户不存在', 404, 404);
  }
}

router.post('/auth/login', asyncHandler(async (req, res) => {
  const username = String(req.body.username || '').trim();
  const { password } = req.body;
  if (!username || !password) {
    throw new AppError('用户名和密码不能为空');
  }

  let admin = await getOne(
    'SELECT id, username, password_hash, nickname FROM admin_users WHERE username = ?',
    [username]
  );
  if (admin) {
    admin.source = 'admin_user';
  } else {
    admin = await getOne(
      "SELECT id, username, password_hash, nickname, role FROM users WHERE username = ? AND role = 'admin'",
      [username]
    );
    if (admin) {
      admin.source = 'user';
    }
  }
  if (!admin) {
    throw new AppError('用户名或密码错误');
  }

  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) {
    throw new AppError('用户名或密码错误');
  }

  sendSuccess(res, {
    token: signAdminToken(admin),
    admin: {
      id: admin.id,
      username: admin.username,
      nickname: admin.nickname,
      role: 'admin',
      source: admin.source
    }
  });
}));

router.use(authenticateAdmin);

router.get('/dashboard', asyncHandler(async (req, res) => {
  const [userStats, catStats, helpStats, pendingStats, commentStats, recentHelpPosts, recentComments] = await Promise.all([
    getOne('SELECT COUNT(*) AS total FROM users'),
    getOne('SELECT COUNT(*) AS total FROM cats'),
    getOne('SELECT COUNT(*) AS total FROM help_posts'),
    getOne("SELECT COUNT(*) AS total FROM help_posts WHERE status = 'pending'"),
    getOne('SELECT COUNT(*) AS total FROM comments'),
    query(`SELECT hp.id, hp.title, hp.type, hp.location, hp.status, hp.created_at AS createdAt,
           u.nickname AS userNickname
           FROM help_posts hp
           JOIN users u ON u.id = hp.user_id
           ORDER BY hp.created_at DESC
           LIMIT 5`),
    query(`SELECT c.id, c.target_type AS targetType, c.target_id AS targetId, c.content,
           c.created_at AS createdAt, u.nickname AS userNickname,
           CASE WHEN c.target_type = 'cat' THEN cats.name ELSE hp.title END AS targetTitle
           FROM comments c
           JOIN users u ON u.id = c.user_id
           LEFT JOIN cats ON c.target_type = 'cat' AND cats.id = c.target_id
           LEFT JOIN help_posts hp ON c.target_type = 'help_post' AND hp.id = c.target_id
           ORDER BY c.created_at DESC
           LIMIT 5`)
  ]);

  sendSuccess(res, {
    userCount: userStats.total,
    catCount: catStats.total,
    helpPostCount: helpStats.total,
    pendingHelpPostCount: pendingStats.total,
    commentCount: commentStats.total,
    recentHelpPosts,
    recentComments
  });
}));

router.get('/cats', asyncHandler(async (req, res) => {
  const { page, pageSize, offset } = parsePagination(req.query);
  const conditions = ['1 = 1'];
  const params = [];
  if (req.query.keyword) {
    conditions.push('(name LIKE ? OR location LIKE ?)');
    const keyword = `%${req.query.keyword}%`;
    params.push(keyword, keyword);
  }
  if (req.query.isAdoptable !== undefined) {
    conditions.push('is_adoptable = ?');
    params.push(numberFlag(req.query.isAdoptable));
  }
  if (req.query.isNeutered !== undefined) {
    conditions.push('is_neutered = ?');
    params.push(numberFlag(req.query.isNeutered));
  }
  const where = conditions.join(' AND ');
  const totalRow = await getOne(`SELECT COUNT(*) AS total FROM cats WHERE ${where}`, params);
  const limitOffset = buildLimitOffset(pageSize, offset);
  const rows = await query(
    `SELECT id, name, image_url AS imageUrl, gender, age, color, personality, location,
     health_status AS healthStatus, is_neutered AS isNeutered, is_adoptable AS isAdoptable,
     needs_attention AS needsAttention, remark, created_at AS createdAt, updated_at AS updatedAt
     FROM cats WHERE ${where}
     ORDER BY id ASC
     ${limitOffset}`,
    params
  );
  sendSuccess(res, paged(boolRows(rows, ['isNeutered', 'isAdoptable', 'needsAttention']), totalRow.total, page, pageSize));
}));

router.post('/cats', asyncHandler(async (req, res) => {
  const cat = parseCatBody(req.body);
  const result = await query(
    `INSERT INTO cats (name, image_url, gender, age, color, personality, location, health_status,
     is_neutered, is_adoptable, needs_attention, remark)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [cat.name, cat.imageUrl, cat.gender, cat.age, cat.color, cat.personality, cat.location, cat.healthStatus,
      cat.isNeutered, cat.isAdoptable, cat.needsAttention, cat.remark]
  );
  const created = await getOne('SELECT id, name FROM cats WHERE id = ?', [result.insertId]);
  sendSuccess(res, created, '创建成功');
}));

router.put('/cats/:id', asyncHandler(async (req, res) => {
  const cat = parseCatBody(req.body);
  const result = await query(
    `UPDATE cats SET name = ?, image_url = ?, gender = ?, age = ?, color = ?, personality = ?,
     location = ?, health_status = ?, is_neutered = ?, is_adoptable = ?, needs_attention = ?, remark = ?
     WHERE id = ?`,
    [cat.name, cat.imageUrl, cat.gender, cat.age, cat.color, cat.personality, cat.location, cat.healthStatus,
      cat.isNeutered, cat.isAdoptable, cat.needsAttention, cat.remark, req.params.id]
  );
  if (result.affectedRows === 0) throw new AppError('猫咪不存在', 404, 404);
  sendSuccess(res, { id: Number(req.params.id) }, '更新成功');
}));

router.delete('/cats/:id', asyncHandler(async (req, res) => {
  await withTransaction((connection) => deleteCat(connection, req.params.id));
  sendSuccess(res, { id: Number(req.params.id) }, '删除成功');
}));

router.get('/help-posts', asyncHandler(async (req, res) => {
  const { page, pageSize, offset } = parsePagination(req.query);
  const { where, params } = helpPostRoutes.buildHelpWhere(req.query);
  const totalRow = await getOne(`SELECT COUNT(*) AS total FROM help_posts hp WHERE ${where}`, params);
  const limitOffset = buildLimitOffset(pageSize, offset);
  const rows = await query(
    `SELECT hp.id, hp.title, hp.type, hp.description, hp.location, hp.contact_phone AS contactPhone,
     hp.status, hp.created_at AS createdAt, hp.updated_at AS updatedAt,
     u.id AS userId, u.nickname AS userNickname
     FROM help_posts hp
     JOIN users u ON u.id = hp.user_id
     WHERE ${where}
     ORDER BY hp.created_at DESC
     ${limitOffset}`,
    params
  );
  sendSuccess(res, paged(await helpPostRoutes.attachImages(rows), totalRow.total, page, pageSize));
}));

router.post('/help-posts', asyncHandler(async (req, res) => {
  const body = helpPostRoutes.validateHelpBody(req.body, { defaultStatus: req.body.status || 'pending' });
  const userId = Number(req.body.userId || req.body.user_id);
  if (!userId) throw new AppError('管理员创建求助领养信息需要 userId');
  const user = await getOne('SELECT id FROM users WHERE id = ?', [userId]);
  if (!user) throw new AppError('发布人不存在', 404, 404);

  const result = await withTransaction(async (connection) => {
    const [insertResult] = await connection.execute(
      `INSERT INTO help_posts (title, type, description, location, contact_phone, user_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [body.title, body.type, body.description, body.location, body.contactPhone, userId, body.status]
    );
    for (const [index, imageUrl] of body.images.entries()) {
      await connection.execute(
        'INSERT INTO help_post_images (post_id, image_url, sort_order) VALUES (?, ?, ?)',
        [insertResult.insertId, imageUrl, index + 1]
      );
    }
    return insertResult;
  });
  sendSuccess(res, { id: result.insertId }, '创建成功');
}));

router.put('/help-posts/:id', asyncHandler(async (req, res) => {
  const existing = await getOne('SELECT id, user_id AS userId FROM help_posts WHERE id = ?', [req.params.id]);
  if (!existing) throw new AppError('求助领养信息不存在', 404, 404);
  const body = helpPostRoutes.validateHelpBody(req.body, { defaultStatus: req.body.status || 'pending' });
  const userId = Number(req.body.userId || req.body.user_id || existing.userId);
  const user = await getOne('SELECT id FROM users WHERE id = ?', [userId]);
  if (!user) throw new AppError('发布人不存在', 404, 404);

  await withTransaction(async (connection) => {
    await connection.execute(
      `UPDATE help_posts SET title = ?, type = ?, description = ?, location = ?, contact_phone = ?,
       user_id = ?, status = ? WHERE id = ?`,
      [body.title, body.type, body.description, body.location, body.contactPhone, userId, body.status, req.params.id]
    );
    await connection.execute('DELETE FROM help_post_images WHERE post_id = ?', [req.params.id]);
    for (const [index, imageUrl] of body.images.entries()) {
      await connection.execute(
        'INSERT INTO help_post_images (post_id, image_url, sort_order) VALUES (?, ?, ?)',
        [req.params.id, imageUrl, index + 1]
      );
    }
  });
  sendSuccess(res, { id: Number(req.params.id) }, '更新成功');
}));

router.patch('/help-posts/:id/status', asyncHandler(async (req, res) => {
  const status = String(req.body.status || '').trim();
  if (!HELP_STATUS.includes(status)) throw new AppError('状态不合法');
  const result = await query('UPDATE help_posts SET status = ? WHERE id = ?', [status, req.params.id]);
  if (result.affectedRows === 0) throw new AppError('求助领养信息不存在', 404, 404);
  sendSuccess(res, { id: Number(req.params.id), status }, '状态已更新');
}));

router.delete('/help-posts/:id', asyncHandler(async (req, res) => {
  await withTransaction((connection) => deleteHelpPost(connection, req.params.id));
  sendSuccess(res, { id: Number(req.params.id) }, '删除成功');
}));

router.get('/comments', asyncHandler(async (req, res) => {
  const { page, pageSize, offset } = parsePagination(req.query);
  const conditions = ['1 = 1'];
  const params = [];
  if (req.query.targetType) {
    conditions.push('c.target_type = ?');
    params.push(req.query.targetType);
  }
  if (req.query.keyword) {
    conditions.push('(c.content LIKE ? OR u.nickname LIKE ? OR u.username LIKE ?)');
    const keyword = `%${req.query.keyword}%`;
    params.push(keyword, keyword, keyword);
  }
  const where = conditions.join(' AND ');
  const totalRow = await getOne(
    `SELECT COUNT(*) AS total FROM comments c JOIN users u ON u.id = c.user_id WHERE ${where}`,
    params
  );
  const limitOffset = buildLimitOffset(pageSize, offset);
  const rows = await query(
    `SELECT c.id, c.target_type AS targetType, c.target_id AS targetId, c.content,
     c.created_at AS createdAt, u.id AS userId, u.username, u.nickname AS userNickname,
     CASE WHEN c.target_type = 'cat' THEN cats.name ELSE hp.title END AS targetTitle
     FROM comments c
     JOIN users u ON u.id = c.user_id
     LEFT JOIN cats ON c.target_type = 'cat' AND cats.id = c.target_id
     LEFT JOIN help_posts hp ON c.target_type = 'help_post' AND hp.id = c.target_id
     WHERE ${where}
     ORDER BY c.created_at DESC, c.id DESC
     ${limitOffset}`,
    params
  );
  sendSuccess(res, paged(rows, totalRow.total, page, pageSize));
}));

router.delete('/comments/:id', asyncHandler(async (req, res) => {
  const result = await query('DELETE FROM comments WHERE id = ?', [req.params.id]);
  if (result.affectedRows === 0) throw new AppError('评论不存在', 404, 404);
  sendSuccess(res, { id: Number(req.params.id) }, '删除成功');
}));

router.get('/users', asyncHandler(async (req, res) => {
  const { page, pageSize, offset } = parsePagination(req.query);
  const conditions = ['1 = 1'];
  const params = [];
  if (req.query.keyword) {
    conditions.push('(username LIKE ? OR nickname LIKE ?)');
    const keyword = `%${req.query.keyword}%`;
    params.push(keyword, keyword);
  }
  const where = conditions.join(' AND ');
  const totalRow = await getOne(`SELECT COUNT(*) AS total FROM users WHERE ${where}`, params);
  const limitOffset = buildLimitOffset(pageSize, offset);
  const rows = await query(
    `SELECT id, username, nickname, avatar, role, created_at AS createdAt, updated_at AS updatedAt
     FROM users WHERE ${where}
     ORDER BY id ASC
     ${limitOffset}`,
    params
  );
  sendSuccess(res, paged(rows, totalRow.total, page, pageSize));
}));

router.put('/users/:id', asyncHandler(async (req, res) => {
  const nickname = String(req.body.nickname || '').trim();
  const avatar = req.body.avatar || null;
  const role = String(req.body.role || 'user').trim();
  if (!nickname) throw new AppError('昵称不能为空');
  if (!USER_ROLES.includes(role)) throw new AppError('用户角色不合法');
  const result = await query(
    'UPDATE users SET nickname = ?, avatar = ?, role = ? WHERE id = ?',
    [nickname, avatar, role, req.params.id]
  );
  if (result.affectedRows === 0) throw new AppError('用户不存在', 404, 404);
  sendSuccess(res, { id: Number(req.params.id) }, '更新成功');
}));

router.delete('/users/:id', asyncHandler(async (req, res) => {
  await withTransaction((connection) => deleteUser(connection, req.params.id));
  sendSuccess(res, { id: Number(req.params.id) }, '删除成功');
}));

router.get('/banners', asyncHandler(async (req, res) => {
  const rows = await query(
    `SELECT id, image_url AS imageUrl, title, subtitle, link_type AS linkType,
     link_target AS linkTarget, sort_order AS sortOrder, is_visible AS isVisible,
     created_at AS createdAt, updated_at AS updatedAt
     FROM banners
     ORDER BY sort_order ASC, id ASC`
  );
  sendSuccess(res, boolRows(rows, ['isVisible']));
}));

function parseBannerBody(body) {
  const imageUrl = String(body.imageUrl || body.image_url || '').trim();
  const title = String(body.title || '').trim();
  if (!imageUrl || !title) throw new AppError('轮播图图片和标题不能为空');
  return {
    imageUrl,
    title,
    subtitle: body.subtitle || null,
    linkType: body.linkType || body.link_type || null,
    linkTarget: body.linkTarget || body.link_target || null,
    sortOrder: Number(body.sortOrder ?? body.sort_order ?? 0),
    isVisible: numberFlag(body.isVisible ?? body.is_visible ?? 1)
  };
}

router.post('/banners', asyncHandler(async (req, res) => {
  const banner = parseBannerBody(req.body);
  const result = await query(
    `INSERT INTO banners (image_url, title, subtitle, link_type, link_target, sort_order, is_visible)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [banner.imageUrl, banner.title, banner.subtitle, banner.linkType, banner.linkTarget, banner.sortOrder, banner.isVisible]
  );
  sendSuccess(res, { id: result.insertId }, '创建成功');
}));

router.put('/banners/:id', asyncHandler(async (req, res) => {
  const banner = parseBannerBody(req.body);
  const result = await query(
    `UPDATE banners SET image_url = ?, title = ?, subtitle = ?, link_type = ?,
     link_target = ?, sort_order = ?, is_visible = ? WHERE id = ?`,
    [banner.imageUrl, banner.title, banner.subtitle, banner.linkType, banner.linkTarget,
      banner.sortOrder, banner.isVisible, req.params.id]
  );
  if (result.affectedRows === 0) throw new AppError('轮播图不存在', 404, 404);
  sendSuccess(res, { id: Number(req.params.id) }, '更新成功');
}));

router.delete('/banners/:id', asyncHandler(async (req, res) => {
  const result = await query('DELETE FROM banners WHERE id = ?', [req.params.id]);
  if (result.affectedRows === 0) throw new AppError('轮播图不存在', 404, 404);
  sendSuccess(res, { id: Number(req.params.id) }, '删除成功');
}));

router.get('/configs', asyncHandler(async (req, res) => {
  const rows = await query(
    `SELECT config_key AS configKey, config_value AS configValue, description, updated_at AS updatedAt
     FROM app_configs
     ORDER BY config_key ASC`
  );
  sendSuccess(res, rows);
}));

router.put('/configs/:key', asyncHandler(async (req, res) => {
  const configValue = req.body.configValue ?? req.body.config_value;
  if (configValue === undefined || configValue === null) throw new AppError('配置值不能为空');
  const result = await query(
    'UPDATE app_configs SET config_value = ? WHERE config_key = ?',
    [String(configValue), req.params.key]
  );
  if (result.affectedRows === 0) throw new AppError('配置项不存在', 404, 404);
  sendSuccess(res, { configKey: req.params.key, configValue: String(configValue) }, '更新成功');
}));

module.exports = router;
