SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS campus_cat_station
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE campus_cat_station;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  avatar VARCHAR(255) NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_admin_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET @add_users_role := (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE users ADD COLUMN role ENUM(''user'',''admin'') NOT NULL DEFAULT ''user'' AFTER avatar',
    'SELECT 1'
  )
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'role'
);
PREPARE add_users_role_stmt FROM @add_users_role;
EXECUTE add_users_role_stmt;
DEALLOCATE PREPARE add_users_role_stmt;

CREATE TABLE IF NOT EXISTS cats (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  gender ENUM('male','female','unknown') NOT NULL,
  age VARCHAR(50) NULL,
  color VARCHAR(50) NULL,
  personality VARCHAR(255) NULL,
  location VARCHAR(100) NOT NULL,
  health_status VARCHAR(255) NOT NULL,
  is_neutered TINYINT NOT NULL DEFAULT 0,
  is_adoptable TINYINT NOT NULL DEFAULT 0,
  needs_attention TINYINT NOT NULL DEFAULT 0,
  remark TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_cats_name (name),
  KEY idx_cats_flags (is_adoptable, is_neutered, needs_attention),
  KEY idx_cats_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS help_posts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(20) NOT NULL,
  type ENUM('help','adoption','feeding','neuter','injury','other') NOT NULL,
  description VARCHAR(500) NOT NULL,
  location VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(30) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  status ENUM('pending','processing','done') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_help_posts_type_status (type, status),
  KEY idx_help_posts_user_id (user_id),
  KEY idx_help_posts_created_at (created_at),
  CONSTRAINT fk_help_posts_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS help_post_images (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  post_id BIGINT UNSIGNED NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_help_post_images_post_id (post_id),
  CONSTRAINT fk_help_post_images_post
    FOREIGN KEY (post_id) REFERENCES help_posts (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS comments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  target_type ENUM('cat','help_post') NOT NULL,
  target_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  content VARCHAR(300) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_comments_target (target_type, target_id),
  KEY idx_comments_user_id (user_id),
  KEY idx_comments_created_at (created_at),
  CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS banners (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  image_url VARCHAR(255) NOT NULL,
  title VARCHAR(100) NOT NULL,
  subtitle VARCHAR(255) NULL,
  link_type VARCHAR(50) NULL,
  link_target VARCHAR(255) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible TINYINT NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_banners_visible_sort (is_visible, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS app_configs (
  config_key VARCHAR(100) NOT NULL,
  config_value TEXT NOT NULL,
  description VARCHAR(255) NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
