# TabBar 几何记录

## 参考来源

- `效果图/首页要轮播图.png`
- `效果图/ChatGPT Image 2026年6月8日 19_00_57 (2).png`

## 页面边界

- 本轮只统一小程序四个主 Tab 页底部导航：`pages/home/index`、`pages/cats/index`、`pages/help/index`、`pages/mine/index`。
- 使用微信原生 `app.json` TabBar。
- 四个主页面内不再保留手写固定底栏。

## 量测结论

- 首页参考图屏幕内容宽约 743px。
- 首页参考图 TabBar 图标可见高度约 51-53px。
- 猫咪图鉴参考图 TabBar 图标可见高度约 52-53px。
- 求助领养图标由不连续笔画组成，单个连通域会被拆开，按视觉合并后仍应占同一图标槽。

## 素材映射

| 区域 | 源素材 | 输出路径 | 裁剪方式 | 输出画布 | 可见主体目标 |
|---|---|---|---|---:|---:|
| TabBar 首页 | `tabbar_assets/icons/tabbar_icon_sheet.png` | `/static/icons/tabbar/icon_tab_home_inactive.png`、`/static/icons/tabbar/icon_tab_home_active.png` | alpha bbox 紧裁 | 81x81 | 约 78px 高 |
| TabBar 猫咪图鉴 | `tabbar_assets/icons/tabbar_icon_sheet.png` | `/static/icons/tabbar/icon_tab_catbook_inactive.png`、`/static/icons/tabbar/icon_tab_catbook_active.png` | alpha bbox 紧裁 | 81x81 | 约 78px 高 |
| TabBar 求助领养 | `tabbar_assets/icons/tabbar_icon_sheet.png` | `/static/icons/tabbar/icon_tab_help_inactive.png`、`/static/icons/tabbar/icon_tab_help_active.png` | alpha bbox 紧裁 | 81x81 | 约 78px 高 |
| TabBar 我的 | `tabbar_assets/icons/tabbar_icon_sheet.png` | `/static/icons/tabbar/icon_tab_mine_inactive.png`、`/static/icons/tabbar/icon_tab_mine_active.png` | alpha bbox 紧裁 | 81x81 | 约 78px 高 |

## 验收口径

- 已执行：参考图静态量测、运行 PNG alpha bbox 校验、`app.json` 路径校验。
- 未执行：微信开发者工具截图 diff。
- 当前环境无法验证：真机安全区和微信 DevTools 实际渲染截图。
