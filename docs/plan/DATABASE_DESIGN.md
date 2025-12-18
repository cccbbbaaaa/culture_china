# 数据库设计（Database Design）

> **最后更新：2025-12-18**  
> 数据源：`temp/data/学员风采/校友信息库更新（源收集结果）.xlsx`、`temp/data/外链资源/公众号推文.csv` 以及对应图片 Zip。  
> 环境：Vercel + Supabase（PostgreSQL + Storage）。

---

## 1. 设计目标

1. 将问卷导出的 **学员风采** 数据与图片统一落地到数据库 + Supabase Storage，支撑前台展示与后续 CMS。
2. 对 **外链资源**（公众号推文）建立 CRUD 能力，支撑首页/活动/课程等板块的内容流。
3. 为 **首页轮播与活动图片** 提供独立的媒体表，允许在运维后台配置图片、标题、副标题、跳转链接。
4. 提供 **批量上传接口**（Excel + 图片 Zip，可选逐张上传）并在服务端完成数据清洗、裁剪压缩、写库。

---

## 2. 数据源与导入要求

| 模块 | 原始格式 | 处理规则 |
| --- | --- | --- |
| 学员风采 | Excel + 图片 Zip | 以 **电子邮箱 + 提交时间** 唯一（同一批次如重复则取最新一行）；需同时在「自我介绍」与「个人照片」选项中选择“愿意”；照片强制输出 **5:7**（缩放+留白）、压缩 **< 1 MB**。 |
| 外链资源 | CSV | 字段：标题、推文类型、发布日期、链接、简介、年份。类型暂不做映射，但不允许多标签。 |
| 活动/轮播图片 | 单张或 Zip | 元数据仅需标题、副标题、跳转链接；图片统一裁剪 + 压缩后存储。 |

脚本 `scripts/analyze-temp-data.ts` 已可输出字段统计，用于校验后续导入逻辑。

---

## 3. 表结构设计

### 3.1 公共：上传批次 `upload_batches`

记录每次导入（Excel/CSV/Zip）的上下文，便于追溯。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | serial PK | |
| `batch_type` | text | `alumni_excel` / `alumni_photos` / `resource_csv` / `media_zip` |
| `source_filename` | text | 上传文件名 |
| `submitted_by` | text | 记录管理员邮箱/姓名（后台表单传入） |
| `total_rows` | integer | 文件中记录总数 |
| `accepted_rows` | integer | 实际写入数量 |
| `status` | text | `pending` / `processing` / `completed` / `failed` |
| `notes` | text | 错误原因或备注 |
| `started_at` / `finished_at` | timestamp | 批次时序 |

### 3.2 学员风采

#### 3.2.1 `alumni_profiles`

- 唯一约束：`unique(email, submission_ts)`，上传时若命中则覆盖（同一份问卷导出的行被视为最新记录）。
- 仍建议保留 `name + cohort` 字段以便展示，但不再作为判定依据。
- “电子邮箱 + 提交时间” 组合写入 `submission_email` + `submission_ts` 字段，保留原始问卷标识。
- 仅当「自我介绍」「个人照片」均为“愿意”才入库。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | serial PK | |
| `name` | text | 姓名 |
| `cohort` | integer | 期数（转换为数字，例如“第十一期”->11） |
| `gender` | text | “男/女/其他” |
| `major` | text | 本科专业 |
| `email` | text | 电子邮箱 |
| `city` | text | 当前城市 |
| `industry` | text | 当前行业 |
| `occupation` | text | 当前职业 |
| `bio_zh` / `bio_en` | text | 自我介绍（中/英） |
| `allow_bio` / `allow_photo` | boolean | 问卷选择 |
| `website_url` | text | 个人链接（可为空） |
| `photo_asset_id` | integer FK -> `media_assets.id` | 对应压缩后照片 |
| `submission_email` | text | 问卷原始邮箱 |
| `submission_ts` | timestamp | 提交时间 |
| `batch_id` | integer FK -> `upload_batches.id` | 来源批次 |
| `created_at` / `updated_at` | timestamp | |

#### 3.2.2 `alumni_educations`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | serial PK | |
| `profile_id` | integer FK -> `alumni_profiles.id` | |
| `order` | integer | 1~5 |
| `description` | text | 原文存储（如“上海交通大学…博士”） |

#### 3.2.3 `alumni_experiences`

结构与 `alumni_educations` 相同，仅描述工作经历（最多 5 条）。

### 3.3 外链资源 `external_resources`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | serial PK | |
| `title` | text | 推文标题 |
| `type` | text | 推文类型（原始 CSV 文案） |
| `summary` | text | 推文简介 |
| `url` | text | 公众号链接 |
| `published_at` | date | 推文发布日期 |
| `year` | integer | 便于筛选 |
| `is_featured` | boolean | 首页/重点推荐 |
| `is_pinned` | boolean | 置顶 |
| `batch_id` | integer FK | 对应 CSV 导入批次（如手动录入则可为空） |
| `created_at` / `updated_at` | timestamp | |

> 现有 `src/db/schema.ts` 中的 `resources` 表将升级为上述字段集合，并保持 Drizzle 类型定义同步。

### 3.4 媒体与轮播

#### 3.4.1 `media_assets`

统一记录上传后的图片元数据，便于复用。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | serial PK | |
| `storage_path` | text | Supabase Storage 路径（例如 `alumni/photos/xxx.jpg`） |
| `width` / `height` | integer | 处理后的尺寸 |
| `filesize` | integer | 字节数，需 < 1MB |
| `ratio` | numeric | 实际宽高比（应接近 0.714，即 5:7） |
| `usage` | text | `alumni_photo` / `activity_banner` 等 |
| `batch_id` | integer FK | 来源批次 |
| `created_at` | timestamp | |

#### 3.4.2 `activity_media`

用于首页轮播、活动图集等配置。新增 `slot_key` 字段标记生效区域，作为上传时的必填值（初期限定为 `home_hero`、`activities_gallery`，后续可按需扩展）。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | serial PK | |
| `title` | text | 标题 |
| `subtitle` | text | 副标题 |
| `link_url` | text | 点击跳转链接 |
| `media_id` | integer FK -> `media_assets.id` | |
| `slot_key` | text | 轮播区域标识（枚举/自由文案，后台做必填） |
| `sort_order` | integer | 控制展示顺序 |
| `is_active` | boolean | |
| `created_at` / `updated_at` | timestamp | |

---

## 4. 数据导入流程（Server Actions / Route Handlers）

### 4.1 学员批量导入 `POST /api/admin/alumni/upload`

**Payload**：`multipart/form-data`，包含 `excel`（必填）、`photos_zip`（可选，Zip 或单图 `photos[]`）。单个文件最大 **1 GB**，超出前端需提示。
**步骤**：
1. 创建 `upload_batches` 记录，状态 `processing`。
2. 读取 Excel，筛选“愿意”双选记录，标准化字段（期数数字化、时间转 ISO）。
3. 如果携带 Zip：按 **temp/data/学员风采/图片/** 中现有嵌套结构解析（允许多级目录）；匹配规则：文件名需与 Excel 的 “个人照片” 字段一致。将文件逐一读取 -> 使用 `sharp` 等比缩放至 5:7（contain/letterbox），若超出 1 MB 自动压缩 -> 上传 Supabase Storage -> 记录 `media_assets`。
4. 以 `email + submission_ts` 查找现有记录，存在则覆盖；同步更新 `alumni_educations` / `alumni_experiences`。同一批次中如果出现相同唯一组合，默认取 Excel 中靠后的行作为最终值。
5. **缺图策略（重要）**：若记录满足“双愿意”但未找到匹配图片文件（字段为空/文件不存在/Zip 中缺失），**仍写入 `alumni_profiles`**，并将 `photo_asset_id = NULL`。前端需采用“无头像”展示样式（见第 8 节）。
6. 写入批次统计：`total_rows`、`accepted_rows`，更新 `status`。
7. 返回 `{ success, batchId, accepted, skipped, errors }`，供后台提示。

> 逐张上传场景：提供 `POST /api/admin/alumni/photo`，接受单图 + `profileId`，相同压缩逻辑，更新 `media_assets` 并写回 `photo_asset_id`。

### 4.2 外链资源导入 `POST /api/admin/resources/upload`

1. 接收 CSV（或后台表单的 JSON）。  
2. 解析字段后写入 `external_resources`，若 URL 已存在则更新对应记录。  
3. 记录批次信息，返回导入结果。  
4. 后台界面提供 CRUD 列表，直接操作同一张表。

### 4.3 活动/轮播图片上传 `POST /api/admin/media/activity`

1. 接收图片（或 Zip）+ 元数据（标题、副标题、链接）。  
2. 重用统一的裁剪压缩逻辑并写入 `media_assets`。  
3. 创建/更新 `activity_media`，提供排序与启用控制。

---

## 5. 图片处理规范

1. **裁剪范围**：  
   - **学员个人照片**：强制输出 `5:7`，使用“等比缩放后在画布中居中贴合”的方式（contain/letterbox），避免硬裁剪导致人脸缺失，允许两侧或上下出现留白。  
   - **活动/轮播图片**：无需强制 5:7，可按上传时提供的尺寸保持比例，仅做必要的长边压缩。
2. **压缩体积**：  
   - 学员个人照片：≤ 1 MB  
   - 活动/轮播图片：≤ 1.5 MB  
   - 优先使用 `jpeg`（80% 质量）或 `webp`（若来源透明图）。  
3. **分辨率建议**：最长边 1600 px，保证网页展示清晰度。  
4. **存储策略**：不保留原图，仅保留处理后的版本；当前暂无 Supabase Storage 目录结构，可在首个实现阶段约定为 `media/{usage}/{batchId}/filename` 并写入文档。

---

## 6. 安全与权限

1. **运维后台登录**：所有 `/admin` 上传接口需校验后台用户登录态（可复用未来的 auth 方案，如 NextAuth / Clerk）。尽管初期无需额外 token，仍需保证匿名用户无法访问上传端点。  
2. **速率限制**：建议对批量导入接口增加基础速率限制与最大并发限制，避免 1 GB 上传导致资源被占满。  
3. **审计记录**：`upload_batches.submitted_by` 字段需由登录用户信息填充，以便回溯操作人。

---

## 7. 后续落地计划

1. 在 `src/db/schema.ts` 中添加上述表结构与 Drizzle 类型定义。  
2. 在 `src/app/api/admin/*` 下实现上传接口（Server Actions + Route Handlers），复用 `sharp` 处理图片。  
3. 在运维后台（`/admin`）集成上传向导（Excel + Zip）、导入历史栈、逐张图片修正入口。  
4. 将首页/活动页面改造为直接读取 `external_resources`、`activity_media`、`alumni_profiles`，完成“后台录入 -> 前台展示”闭环。

如需获取 Supabase 服务密钥或 Storage bucket 配置，请告知。届时可在 `.env` 中增加 `SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY` 等变量，并在 `src/lib/db.ts` 统一管理。

---

## 8. 前端展示规则（与缺图相关）

### 8.1 学员头像展示（`alumni_profiles.photo_asset_id`）

- **有头像**（`photo_asset_id` 非空）：
  - 展示圆形头像（或 5:7 竖版裁切容器内的头像区域）。
- **无头像**（`photo_asset_id` 为空）：
  - 展示“无头像卡片”样式：仅展示姓名、期数、行业/职业、简介摘要等；
  - 可用首字母/姓名首字（Placeholder）或统一的默认头像占位，但需要与“有头像”的视觉区分开（例如边框/背景更素）。

> 说明：导入阶段不因缺图丢弃“双愿意”记录，避免丢失文本信息；缺图的同学后续可通过“逐张上传/补图”功能完善。 
