SET NAMES utf8mb4;

USE campus_cat_station;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE comments;
TRUNCATE TABLE help_post_images;
TRUNCATE TABLE help_posts;
TRUNCATE TABLE cats;
TRUNCATE TABLE banners;
TRUNCATE TABLE app_configs;
TRUNCATE TABLE admin_users;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO users (id, username, password_hash, nickname, avatar, role, created_at, updated_at) VALUES
  (1, 'cat_user01', '$2b$10$Cy8pcxNk4nriDf5/t5YcHeokgmhFF5wAKITwuuFTiu4ZbReoHXUle', '爱猫同学', '/static/mine/mine_default_user_avatar.png', 'user', '2026-06-01 09:00:00', '2026-06-01 09:00:00'),
  (2, 'cat_user02', '$2b$10$V6peQlFIf36TVXYDKwTjOup5Y8ns5XqNvHpnROrn5axnn/2r0UOEG', '暖心志愿者', '/static/cat-detail/comment_avatar_aimaorenshi.png', 'user', '2026-06-02 10:00:00', '2026-06-02 10:00:00'),
  (3, 'cat_admin01', '$2b$10$ER19xEWNEhrCpuSINl.e/eXWiWSwB5vbtbOm8PTKgNm/ATDRx.oSC', '学生管理员', '/static/mine/mine_default_user_avatar.png', 'admin', '2026-06-02 11:00:00', '2026-06-02 11:00:00');

INSERT INTO admin_users (id, username, password_hash, nickname, created_at, updated_at) VALUES
  (1, 'admin', '$2b$10$ER19xEWNEhrCpuSINl.e/eXWiWSwB5vbtbOm8PTKgNm/ATDRx.oSC', '驿站管理员', '2026-06-01 08:00:00', '2026-06-01 08:00:00');

INSERT INTO cats (
  id, name, image_url, gender, age, color, personality, location,
  health_status, is_neutered, is_adoptable, needs_attention, remark, created_at, updated_at
) VALUES
  (1, '小白', '/static/cats-page/cat_xiaobai.jpg', 'female', '约2岁', '白色', '亲人、安静，喜欢晒太阳', '图书馆东门', '健康，已完成基础驱虫', 1, 1, 0, '经常在图书馆附近活动，适合有养猫经验的同学关注。', '2026-06-01 09:10:00', '2026-06-01 09:10:00'),
  (2, '小花', '/static/cats-page/cat_xiaohua.jpg', 'female', '约1岁半', '三花', '警觉但温和，熟悉后会靠近', '二食堂后门', '健康，近期食欲正常', 1, 0, 0, '三花妹妹，已稳定投喂。', '2026-06-01 09:20:00', '2026-06-01 09:20:00'),
  (3, '橘子', '/static/cats-page/cat_juzi.jpg', 'male', '约3岁', '橘色', '胆大、爱撒娇、饭量大', '操场看台', '健康，体型偏胖', 1, 0, 0, '校园熟面孔，雨天常躲在看台下。', '2026-06-01 09:30:00', '2026-06-01 09:30:00'),
  (4, '阿福', '/static/cats-page/cat_afu.jpg', 'male', '约8个月', '奶牛色', '活泼、好奇', '宿舍区花坛', '轻微流泪，需观察', 0, 1, 1, '幼猫性格活泼，建议持续观察眼部情况。', '2026-06-01 09:40:00', '2026-06-01 09:40:00'),
  (5, '奶盖', '/static/cats-page/cat_naigai.jpg', 'unknown', '约6个月', '浅橘白', '怕生、依赖同伴', '教学楼连廊', '健康，未绝育', 0, 1, 0, '暂未确认性别，适合后续补充档案。', '2026-06-01 09:50:00', '2026-06-01 09:50:00'),
  (6, '芝麻', '/static/cats-page/cat_zhima.jpg', 'female', '约2岁半', '黑白', '谨慎、固定时间出现', '北门快递点', '疑似皮肤轻微脱毛，需关注', 1, 0, 1, '建议志愿者每周记录一次皮肤状态。', '2026-06-01 10:00:00', '2026-06-01 10:00:00');

INSERT INTO help_posts (
  id, title, type, description, location, contact_phone, user_id, status, created_at, updated_at
) VALUES
  (1, '小白求领养', 'adoption', '小白性格稳定，已绝育，希望找到长期负责的同学或校友领养。', '图书馆东门', '13812341234', 1, 'processing', '2026-06-03 09:00:00', '2026-06-03 09:00:00'),
  (2, '小猫受伤', 'injury', '在宿舍区花坛附近看到一只奶牛幼猫走路不稳，需要志愿者确认情况。', '宿舍区花坛', '13900001111', 2, 'pending', '2026-06-03 10:30:00', '2026-06-03 10:30:00'),
  (3, '操场喂养提醒', 'feeding', '最近操场看台下有多只猫固定出现，请投喂后带走垃圾。', '操场看台', '13700002222', 1, 'done', '2026-06-04 12:20:00', '2026-06-04 12:20:00'),
  (4, '三花绝育排期', 'neuter', '二食堂附近三花已稳定出现，想协调本周末绝育排期。', '二食堂后门', '13600003333', 2, 'processing', '2026-06-05 08:45:00', '2026-06-05 08:45:00'),
  (5, '快递点需观察', 'help', '北门快递点黑白猫疑似皮肤问题，请路过同学帮忙观察拍照。', '北门快递点', '13500004444', 1, 'pending', '2026-06-05 18:10:00', '2026-06-05 18:10:00'),
  (6, '教学楼幼猫', 'other', '教学楼连廊附近出现浅橘白幼猫，暂未确认是否有猫妈妈陪伴。', '教学楼连廊', '13400005555', 2, 'done', '2026-06-06 15:00:00', '2026-06-06 15:00:00');

INSERT INTO help_post_images (id, post_id, image_url, sort_order) VALUES
  (1, 1, '/static/home/home_help_thumb_xiaobai.png', 1),
  (2, 2, '/static/publish/publish_upload_thumb_xiaobai.png', 1),
  (3, 2, '/static/mypost/mypost_thumb_buou.png', 2),
  (4, 3, '/static/help-adoption/help_thumb_juzi.png', 1),
  (5, 4, '/static/help-adoption/help_thumb_xiaohua.png', 1),
  (6, 5, '/static/mycomments/target_xiaohua.png', 1),
  (7, 6, '/static/mypost/mypost_thumb_kittens.png', 1);

INSERT INTO comments (id, target_type, target_id, user_id, content, created_at) VALUES
  (1, 'cat', 1, 2, '今天中午在图书馆东门看到小白，状态很好。', '2026-06-06 12:00:00'),
  (2, 'cat', 3, 1, '橘子又在操场看台晒太阳了，很亲人。', '2026-06-06 13:10:00'),
  (3, 'cat', 6, 2, '芝麻皮肤状态还要继续观察，我明天再去看看。', '2026-06-06 18:30:00'),
  (4, 'help_post', 1, 2, '我可以帮忙做领养回访，已私信联系。', '2026-06-07 09:15:00'),
  (5, 'help_post', 2, 1, '下午四点可以去宿舍区确认一下。', '2026-06-07 10:20:00'),
  (6, 'help_post', 5, 2, '昨晚看到它还在快递点，精神还可以。', '2026-06-07 20:00:00');

INSERT INTO banners (
  id, image_url, title, subtitle, link_type, link_target, sort_order, is_visible, created_at, updated_at
) VALUES
  (1, '/static/home/home_swiper_banner_01_opaque.webp', '校园拾喵驿站', '一起记录、守护校园里的小生命', 'page', '/pages/cats/index', 1, 1, '2026-06-01 08:30:00', '2026-06-01 08:30:00'),
  (2, '/static/help-adoption/help_swiper_banner_01.png', '求助领养信息', '发现异常情况，及时发布求助', 'page', '/pages/help/index', 2, 1, '2026-06-01 08:35:00', '2026-06-01 08:35:00'),
  (3, '/static/publish/publish_tip_banner_01.png', '规范发布', '清晰描述地点、状态和联系方式', 'page', '/pages/publish/index', 3, 1, '2026-06-01 08:40:00', '2026-06-01 08:40:00');

INSERT INTO app_configs (config_key, config_value, description, updated_at) VALUES
  ('platform_name', '校园拾喵驿站', '平台名称', '2026-06-01 08:00:00'),
  ('home_slogan', '把每一次遇见，变成更好的守护', '首页主文案', '2026-06-01 08:00:00'),
  ('home_subtitle', '记录猫咪档案、发布求助领养、连接校园志愿者', '首页副文案', '2026-06-01 08:00:00'),
  ('about_text', '校园拾喵驿站是一个本地课程项目，用于模拟校园流浪猫信息记录、求助领养与后台管理流程。', '关于平台文案', '2026-06-01 08:00:00'),
  ('stats_text', '已有同学共同参与校园猫咪守护', '首页统计文案', '2026-06-01 08:00:00');
