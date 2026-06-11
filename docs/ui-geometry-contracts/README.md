# 页面几何记录模板

本目录用于记录小程序页面复刻、截图还原、裁剪图接入时的几何契约。不是设计稿，也不是验收报告；它是写页面前的最小事实表。

## 何时必须填写

- 用户要求像素级复刻、尽量贴近截图、按效果图重做。
- 页面需要裁剪模块图、Banner、卡片、TabBar 图标或复杂局部。
- 同一视觉区域连续两轮 WXML/WXSS 调整仍不接近参考图。
- 存在多个素材来源或需要 fallback。

## 何时可以简化

- 普通列表页、表单页、低精度业务页可以只填 `source-meta.json`、`asset-map.csv` 和 `layout-notes.md`。
- 不涉及裁剪时可以省略 `crop-report.json`，但必须写明“不涉及裁剪”。

## 建议目录

```text
docs/ui-geometry-contracts/<page-name>/
  source-meta.json
  asset-map.csv
  layout-notes.md
  crop-report.json
```

## source-meta.json 模板

```json
{
  "page": "pages/example/index",
  "viewport_width": 750,
  "reference_source": "页面专属素材包/source_reference.png",
  "reference_size": [0, 0],
  "contains_wechat_system_ui": false,
  "authoritative_asset_pack": "页面专属素材包/",
  "fallback_used": false,
  "fallback_approval": "未使用 fallback"
}
```

字段含义：

- `page`：目标页面路径。
- `viewport_width`：设计基准宽度。
- `reference_source`：参考图相对路径或截图角色说明。
- `reference_size`：参考图实际像素尺寸。
- `contains_wechat_system_ui`：参考图是否包含系统状态栏、胶囊或设备壳。
- `authoritative_asset_pack`：权威素材包。
- `fallback_used`：是否使用 fallback。
- `fallback_approval`：用户授权或未使用说明。

## asset-map.csv 模板

```csv
page_area,source_asset,target_runtime_path,asset_type,crop_allowed,transparent_allowed,must_keep_text,notes
首页顶部轮播,页面专属素材包/static/home/example.png,/static/home/example.png,完整横幅,否,否,是,不叠加文字
```

字段含义：

- `page_area`：页面区域。
- `source_asset`：源素材相对路径。
- `target_runtime_path`：小程序运行路径。
- `asset_type`：完整横幅、图标、照片、模块图等。
- `crop_allowed`：是否允许裁剪。
- `transparent_allowed`：是否允许透明化。
- `must_keep_text`：是否必须保留素材内文字。
- `notes`：使用限制。

## layout-notes.md 模板

```markdown
# 页面布局记录

## 关键区域顺序

1. 顶部导航
2. 主图或轮播
3. 主内容模块
4. 列表模块
5. 底部固定区

## 几何约束

- 主图宽度：
- 主图高度：
- 模块间距：
- 卡片圆角：
- 底部安全区：

## 未执行验收

- DevTools 截图：
- 真机截图：
- 自动 diff：
```

## crop-report.json 模板

```json
{
  "source_asset": "页面专属素材包/source_reference.png",
  "source_size": [0, 0],
  "crop_box_xyxy": [0, 0, 0, 0],
  "crop_box_source": "manifest 标注 / 用户确认 / 未确认",
  "output_asset": "static/home/example.png",
  "output_size": [0, 0],
  "preview_checked": false,
  "stop_required": false,
  "notes": ""
}
```

字段含义：

- `source_asset`：裁剪源图相对路径。
- `source_size`：源图实际尺寸。
- `crop_box_xyxy`：裁剪框。
- `crop_box_source`：裁剪框来源。
- `output_asset`：输出素材路径。
- `output_size`：输出尺寸。
- `preview_checked`：是否检查预览。
- `stop_required`：是否触发停止条件。
- `notes`：偏差、风险或未验证项。
