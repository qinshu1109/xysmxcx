# 登录 / 注册账号页面几何记录

## 页面结构

1. 自定义顶部导航：返回按钮 + 页面标题。
2. 背景层：`auth-bg` 使用 `aspectFill` 铺满页面，不参与内容流。
3. 内容层：`auth-content` 负责安全区和页面左右留白。
4. 组合层：`auth-panel` 同时管理吉祥物、表单卡片和底部切换文案。
5. 顶部吉祥物：透明 PNG，位于表单卡片上方。
6. 表单卡片：白色圆角卡片，由 WXML/WXSS 渲染。
7. 输入框、按钮、底部切换文案均由 WXML/WXSS 渲染。

## 素材策略

- 权威素材目录：`auth_login_register_page_assets/auth_page_assets/`。
- 运行素材目录：`static/auth/`。
- 背景和吉祥物只复制到运行目录，不重绘。
- `auth_icon_sheet.png` 是透明图标表，本轮只在运行目录拆出表单图标。
- 没有把整页、表单卡片、输入框、按钮文字裁成图片。
- 素材体检结论：背景未包含表单 UI；登录和注册吉祥物均为透明 PNG，未发现明显矩形底，但原始透明画布过大，可见区域约占画布 bbox 面积一半，直接 `aspectFit` 会导致运行中吉祥物偏小。
- 运行修复：新增 `static/auth/auth_login_mascot_cat_fitted.png` 和 `static/auth/auth_register_mascot_cat_fitted.png`，仅裁掉过大透明边，不重绘吉祥物。

## 布局修复记录

- 登录页和注册页均改为 `auth-page`、`auth-bg`、`auth-content`、`auth-panel` 三层布局。
- `auth-bg` 从 `scaleToFill` 改为 `aspectFill`，避免背景被拉伸导致底部装饰比例漂移。
- 吉祥物从普通流式图片改为 `mascot-wrap` 管理，卡片使用受控负向重叠与吉祥物底部形成压叠关系。
- 层级规则：`mascot-wrap` 必须低于 `auth-card`，白色表单卡片应遮住吉祥物下半部分；禁止让吉祥物覆盖表单标题、输入框或按钮。
- 本轮修复登录/注册页 `z-index` 方向错误：吉祥物层从前景改为背景压叠层，表单卡片层提升到前景。
- 登录页使用 `auth-panel-login`，注册页使用 `auth-panel-register`，两页分别控制顶部留白和卡片高度。
- 表单卡片宽度跟随内容区宽度，输入框和按钮由卡片内部宽度控制，避免卡片宽窄和参考图失衡。

## 交互策略

- 登录页字段：`username`、`password`。
- 注册页字段：`username`、`nickname`、`password`、`confirmPassword`。
- 当前为 mock 预览：登录成功写入本地 `authToken` 和 `authUser`。
- 注册成功后返回登录页。
- 未接入真实 `POST /auth/login` 或 `POST /auth/register`。

## 未验证项

- 未执行微信开发者工具截图对照。
- 未做真机验证。
- 未接入真实后端接口。
- 动态 WXML/WXSS 与效果图仍可能存在细微比例差异，需要 DevTools 截图复核。
