const express = require('express');
const { query, getOne } = require('../config/db');
const { asyncHandler } = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const { boolRows, splitImages } = require('../utils/rows');
const { maskPhone } = require('../utils/phone');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const [configRows, bannerRows, catStats, helpStats, adoptionStats, latestRows, catRows] = await Promise.all([
    query('SELECT config_key AS configKey, config_value AS configValue, description FROM app_configs ORDER BY config_key ASC'),
    query(`SELECT id, image_url AS imageUrl, title, subtitle, link_type AS linkType,
           link_target AS linkTarget, sort_order AS sortOrder, is_visible AS isVisible
           FROM banners WHERE is_visible = 1 ORDER BY sort_order ASC, id ASC`),
    getOne('SELECT COUNT(*) AS total FROM cats'),
    getOne('SELECT COUNT(*) AS total FROM help_posts'),
    getOne("SELECT COUNT(*) AS total FROM help_posts WHERE type = 'adoption' AND status = 'done'"),
    query(`SELECT hp.id, hp.title, hp.type, hp.location, hp.status, hp.created_at AS createdAt,
           hp.contact_phone AS contactPhone, u.nickname AS userNickname,
           GROUP_CONCAT(hpi.image_url ORDER BY hpi.sort_order ASC SEPARATOR ',') AS images
           FROM help_posts hp
           JOIN users u ON u.id = hp.user_id
           LEFT JOIN help_post_images hpi ON hpi.post_id = hp.id
           GROUP BY hp.id
           ORDER BY hp.created_at DESC
           LIMIT 5`),
    query(`SELECT id, name, image_url AS imageUrl, gender, age, color, personality, location,
           health_status AS healthStatus, is_neutered AS isNeutered, is_adoptable AS isAdoptable,
           needs_attention AS needsAttention
           FROM cats
           ORDER BY is_adoptable DESC, needs_attention DESC, updated_at DESC, id ASC
           LIMIT 6`)
  ]);

  const configs = configRows.reduce((acc, row) => {
    acc[row.configKey] = row.configValue;
    return acc;
  }, {});

  const latestHelpPosts = latestRows.map((row) => ({
    ...row,
    contactPhoneMasked: maskPhone(row.contactPhone),
    contactPhone: undefined,
    images: splitImages(row.images)
  }));

  sendSuccess(res, {
    configs,
    banners: boolRows(bannerRows, ['isVisible']),
    stats: {
      catCount: catStats.total,
      helpPostCount: helpStats.total,
      adoptionSuccessCount: adoptionStats.total
    },
    latestHelpPosts,
    recommendedCats: boolRows(catRows, ['isNeutered', 'isAdoptable', 'needsAttention'])
  });
}));

module.exports = router;
