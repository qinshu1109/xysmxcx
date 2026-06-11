# 校园拾喵驿站系统

本项目是“校园拾喵驿站 / 校园流浪猫驿站系统”的本地大作业实现，包含微信小程序同学端、Node.js Express 后端、MySQL 数据库和 Vue 后台管理系统。

本项目按 Windows 原生环境交付，不要求 Docker，不要求 Linux。

## 环境要求

- Windows 10/11。
- Node.js 18 或更高版本。
- MySQL 8.x Windows 版。
- 微信开发者工具。

确认命令可用：

```bat
node -v
npm -v
mysql --version
```

如果 `mysql` 命令不可用，请把 MySQL 安装目录下的 `bin` 加到系统 PATH。

## 目录结构

```text
database/      MySQL 建表和测试数据脚本
server/        Node.js Express API
admin/         Vue 3 后台管理系统
miniprogram/   微信小程序源码
docs/          需求、接口、数据库和验收文档
```

## Windows 一键导入数据库

## 小白一键启动

客户电脑已安装 Node.js 和 MySQL 后，优先使用根目录脚本：

```bat
一键启动.bat
```

脚本会自动完成：

- 检查 `node`、`npm`、`mysql` 命令。
- 如果客户电脑没有 Node.js，会拉起包内 `runtime/nodejs/` 下的 Windows Node.js 安装包，不依赖现场下载。
- 尝试启动常见 MySQL Windows 服务。
- 自动尝试 MySQL `root` 空密码和 `root / 123456`。
- 首次运行时导入数据库。
- 自动生成 `server/.env`。
- 安装 `server/` 和 `admin/` 依赖。
- 分别打开后端 API 和后台管理系统窗口。
- 自动打开后台地址 `http://localhost:5173`。

如果客户 MySQL root 密码不是空密码或 `123456`，脚本会提示输入密码。

如果需要重置测试数据：

```bat
一键启动.bat --reset
```

也可以直接指定 MySQL root 密码：

```bat
一键启动.bat 123456
```

注意：不带 `--reset` 时，脚本不会重复导入 `seed.sql`，避免每次启动清空客户测试数据。

## 手动导入数据库

先确认 MySQL 服务已启动，然后在项目根目录执行：

```bat
database\import-win.bat
```

默认使用 MySQL 用户 `root`，脚本会提示输入密码两次。

如果要指定其他 MySQL 用户：

```bat
database\import-win.bat your_mysql_user
```

脚本会执行：

- `database/init.sql`
- `database/seed.sql`

数据库名：

```text
campus_cat_station
```

SQL 脚本已包含 `SET NAMES utf8mb4;`，导入时也使用 `--default-character-set=utf8mb4`，避免中文乱码。

## 启动后端 API

进入 `server/` 后运行：

```bat
server\start-win.bat
```

脚本会：

- 检查 Node.js 和 npm。
- 如果没有 `server/.env`，从 `server/.env.example` 复制一份。
- 如果没有 `node_modules`，自动执行 `npm install`。
- 启动 Express API。

如 MySQL root 用户有密码，请先编辑：

```text
server/.env
```

重点配置：

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的MySQL密码
DB_DATABASE=campus_cat_station
```

后端地址：

```text
http://localhost:3000/api
```

健康检查：

```text
http://localhost:3000/api/health
```

## 启动后台管理系统

另开一个命令行窗口，运行：

```bat
admin\start-win.bat
```

后台地址：

```text
http://localhost:5173
```

默认后台管理员：

```text
username: admin
password: 123456
```

`users.role = admin` 的普通用户也可以登录后台。

## 启动微信小程序

1. 打开微信开发者工具。
2. 导入当前项目。
3. 确认 `project.config.json` 中 `miniprogramRoot` 为 `miniprogram/`。
4. 确认后端 API 已启动。

小程序接口默认地址：

```text
http://localhost:3000/api
```

默认普通用户：

```text
username: cat_user01
password: 123456
```

默认管理员用户：

```text
username: cat_admin01
password: 123456
```

## 权限说明

- 游客：可浏览公开页面，不能发布、评论或查看个人内容。
- 普通用户：可浏览、发布求助领养、评论、查看自己的发布和评论、删除自己的评论。
- 管理员：可登录后台，管理猫咪、求助领养、评论、用户、轮播图和基础配置。
- 后台用户管理可以把普通用户设置为管理员。
- 小程序“我的”页会刷新当前用户资料，后台调整角色后重新进入“我的”页即可看到最新角色。

## 常见问题

### 后台或小程序显示中文乱码

请重新用 Windows 导入脚本导入数据库：

```bat
database\import-win.bat
```

不要使用未指定字符集的导入命令。

### 后端提示数据库连接失败

检查：

- MySQL 服务是否已启动。
- `server/.env` 中 `DB_PASSWORD` 是否正确。
- `database/import-win.bat` 是否已经执行成功。

### 后台登录失败

确认：

- 后端 `http://localhost:3000/api/health` 正常。
- 数据库已经导入 `seed.sql`。
- 使用 `admin / 123456` 登录。

## 不包含的功能

- 不做真实微信授权。
- 不做短信验证码。
- 不做地图定位。
- 不做在线支付。
- 不做线上部署。
- 不依赖 Docker 或 Linux。
