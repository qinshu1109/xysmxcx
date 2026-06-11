# 校园拾喵驿站后台管理

## 启动

```powershell
cd admin
Copy-Item .env.example .env
npm install
npm run dev
```

默认 API 地址：

```text
http://localhost:3000/api
```

如需调整，修改 `.env`：

```text
VITE_API_BASE_URL=http://localhost:3000/api
```

## 默认账号

```text
username: admin
password: 123456
```

## 图片路径说明

- `/uploads/...` 由后端 Express 静态托管，后台会按 API origin 拼接预览地址。
- `http://` 或 `https://` 开头的完整地址会直接预览。
- `/static/...` 属于小程序运行素材路径，后端当前没有静态托管该目录；后台会保留原路径并展示路径文本，预览是否可见取决于当前浏览器服务是否能访问该路径。

## 本轮范围

- 管理员登录、后台首页、猫咪管理、求助领养管理、评论管理、用户管理、轮播图管理、基础配置。
- 不包含多级权限、管理员注册、修改密码、评论编辑、用户封禁、复杂图表、线上部署。
