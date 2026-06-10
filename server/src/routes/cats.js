const express = require('express');
const { query, getOne } = require('../config/db');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { parsePagination, paged } = require('../utils/pagination');
const { boolFields, boolRows } = require('../utils/rows');

const router = express.Router();

function buildCatWhere(queryParams) {
  const conditions = ['1 = 1'];
  const params = [];

  if (queryParams.keyword) {
    conditions.push('(name LIKE ? OR location LIKE ? OR color LIKE ?)');
    const keyword = `%${queryParams.keyword}%`;
    params.push(keyword, keyword, keyword);
  }

  if (queryParams.filter === 'adoptable') {
    conditions.push('is_adoptable = 1');
  } else if (queryParams.filter === 'neutered') {
    conditions.push('is_neutered = 1');
  } else if (queryParams.filter === 'attention') {
    conditions.push('needs_attention = 1');
  } else if (queryParams.filter === 'healthy') {
    conditions.push("health_status LIKE '%健康%' AND needs_attention = 0");
  }

  return { where: conditions.join(' AND '), params };
}

router.get('/', asyncHandler(async (req, res) => {
  const { page, pageSize, offset } = parsePagination(req.query);
  const { where, params } = buildCatWhere(req.query);
  const totalRow = await getOne(`SELECT COUNT(*) AS total FROM cats WHERE ${where}`, params);
  const rows = await query(
    `SELECT id, name, image_url AS imageUrl, gender, age, color, personality, location,
     health_status AS healthStatus, is_neutered AS isNeutered, is_adoptable AS isAdoptable,
     needs_attention AS needsAttention, remark, created_at AS createdAt, updated_at AS updatedAt
     FROM cats WHERE ${where}
     ORDER BY needs_attention DESC, is_adoptable DESC, id ASC
     LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );

  sendSuccess(res, paged(boolRows(rows, ['isNeutered', 'isAdoptable', 'needsAttention']), totalRow.total, page, pageSize));
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const cat = await getOne(
    `SELECT id, name, image_url AS imageUrl, gender, age, color, personality, location,
     health_status AS healthStatus, is_neutered AS isNeutered, is_adoptable AS isAdoptable,
     needs_attention AS needsAttention, remark, created_at AS createdAt, updated_at AS updatedAt
     FROM cats WHERE id = ?`,
    [req.params.id]
  );
  if (!cat) {
    throw new AppError('猫咪不存在', 404, 404);
  }

  const commentStats = await getOne(
    "SELECT COUNT(*) AS commentCount FROM comments WHERE target_type = 'cat' AND target_id = ?",
    [req.params.id]
  );

  sendSuccess(res, {
    ...boolFields(cat, ['isNeutered', 'isAdoptable', 'needsAttention']),
    stats: {
      commentCount: commentStats.commentCount
    }
  });
}));

module.exports = router;
