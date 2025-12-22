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
| 学员风采 | Excel + 图片 Zip | 以 **电子邮箱 + 提交时间** 唯一（同一批次如重复则取最新一行）；需同时在「自我介绍」与「个人照片」选项中选择“愿意”；照片强制输出 **5:7**（缩放+留白）、压缩 **< 1 MB**。单文件体积需 ≤ **700 MB**。 |
| 外链资源 | CSV | 字段：标题、推文类型、发布日期、链接、简介、年份。类型暂不做映射，但不允许多标签；上传文件体积 ≤ **700 MB**。 |
| 活动/轮播图片 | 单张或 Zip | 元数据仅需标题、副标题、跳转链接；图片统一裁剪 + 压缩后存储；上传文件体积 ≤ **700 MB**。 |

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

### 3.5 外链资源类型映射

`external_resources.type` 由内容采集脚本直接写入，当前约定如下，便于前端路由与分发：

| 类型值 | 前端版块 | UI 标签 |
| --- | --- | --- |
| `活动-年度论坛` | `/activities` | 年度论坛 |
| `活动-访学交流` | `/activities` | 访学交流 |
| `活动-其他活动` | `/activities` | 其他活动 |
| `招生-招生活动` | `/admissions` | 招生活动 |
| `课程-课程回顾/新闻场记` | `/curriculum` | 课程回顾 / Notes |
| `校友故事/随笔/专栏` | 预留（Stories） | 校友故事 |

> 未来若有新增类型，请同步更新 `src/lib/resource-types.ts` 与上表，确保前端渲染一致。

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
2. **速率限制**：建议对批量导入接口增加基础速率限制与最大并发限制，避免 700 MB 上限的上传导致资源被占满。  
3. **审计记录**：`upload_batches.submitted_by` 字段需由登录用户信息填充，以便回溯操作人。

### 6.1 简易账号密码鉴权方案

- **实现方式**：自定义凭证校验，不引入第三方库。`src/lib/admin-auth.ts` 直接从 `.env` 读取账号与明文密码，生成内存用户表：
  ```ts
  type AdminRole = "content_editor" | "super_admin";
  const adminUsers = [
    { username: env.ADMIN_MEDIA_USER, password: env.ADMIN_MEDIA_PASSWORD, role: "content_editor" },
    { username: env.ADMIN_ROOT_USER, password: env.ADMIN_ROOT_PASSWORD, role: "super_admin" },
  ];
  ```
  > 仅用于受控环境，若未来部署到公网需将此方案替换为哈希 + Secrets Manager。
- **会话存储**：使用 `cookies().set()` + `iron-session` 或自实现的 HMAC 签名 Token（`value = base64(username|role|expires|signature)`），有效期默认为 12 小时，可手动注销。
- **角色定义**：
  - `content_editor`：可访问 `/admin/resources`、`/admin/media`，可增删改查外链资源与活动媒体。
  - `super_admin`：拥有全部权限，包括 `/admin/alumni` 相关的学员管理与所有导入动作。
- **路由保护**：在 `/admin/layout.tsx` (Server Component) 中读取 session，确认登录并检查 `role`；未登录跳转 `/admin/login`。对敏感 Server Actions（如 `createAlumniProfile`）在函数顶部校验角色，若权限不足返回 `{ success: false, error: "FORBIDDEN" }`。
- **配置要求**：`.env` 新增 `ADMIN_MEDIA_USER`, `ADMIN_MEDIA_PASSWORD`, `ADMIN_ROOT_USER`, `ADMIN_ROOT_PASSWORD`, `ADMIN_SESSION_SECRET` 等变量；通过 `src/lib/env.ts` 完成 Zod 校验。
- **日志记录**：成功登录 / 登出写入 `upload_batches` 可选 `notes`（如 “login: media_editor”）或未来扩展专用日志。

---

## 7. 后续落地计划

1. 在 `src/db/schema.ts` 中添加上述表结构与 Drizzle 类型定义。  
2. 在 `src/app/api/admin/*` 下实现上传接口（Server Actions + Route Handlers），复用 `sharp` 处理图片。  
3. 在运维后台（`/admin`）集成上传向导（Excel + Zip）、导入历史栈、逐张图片修正入口。  
4. 将首页/活动页面改造为直接读取 `external_resources`、`activity_media`、`alumni_profiles`，完成“后台录入 -> 前台展示”闭环。

如需获取 Supabase 服务密钥或 Storage bucket 配置，请告知。届时可在 `.env` 中增加 `SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY` 等变量，并在 `src/lib/db.ts` 统一管理。

---

## 8. 运维后台模块规划（Admin CMS）

> 目标：为内容运营提供统一的 `/admin` 控制台，完成“列表查阅 + 精准筛选 + 表单增改 + 内容删除/下线 + 批量导入”的闭环；所有提交通过 Server Actions + Zod 校验，写入 Drizzle ORM。

### 8.1 通用策略

- **路由结构**：`/admin` 作为布局，子路由 `alumni`、`resources`、`media`。默认 Server Components，表单/交互组件使用 `"use client"` 并通过 Server Actions mutate。
- **鉴权与权限**：需要登录态（后续可接入 NextAuth/Clerk）。暂时以保护路由 + 中间件校验实现，所有 Server Action 根据会话写入 `upload_batches.submitted_by`。
- **UI 组件**：使用 shadcn/ui 的 DataTable/Form/Dialog/Toast，保留“晨兴红 / 典雅金”视觉。
- **数据层**：所有写操作前使用 Zod Schema 校验；成功后更新相关表并刷新 RSC（`revalidatePath`）。
- **批次追踪**：所有导入/新增操作写入 `upload_batches`，普通单条 CRUD 可复用 `batch_type = manual_entry`。

### 8.2 学员风采管理（`/admin/alumni`）

| 功能 | 说明 |
| --- | --- |
| 列表 & 筛选 | DataTable 展示 `name`、`cohort`、`industry`、`city`、`allow_bio`、`allow_photo`、`photo_asset_id`、`updated_at`。支持期数、行业、是否有头像、关键词（姓名/邮箱）搜索。 |
| 新增 | “手动录入学员”表单：基础信息 + 中英自我介绍 + 是否允许展示。图片可选上传，复用单图上传接口 `POST /api/admin/alumni/photo`（由 Server Action 包装）。 |
| 编辑 | 侧边抽屉或 Dialog，支持更新文字字段、教育/经历（一组可编辑列表），重新绑定 `photo_asset_id`。 |
| 删除 | 采用软删除：`alumni_profiles` 需新增 `is_archived boolean default false`，后台删除仅标记归档，前台查询需排除。 |
| 批量导入 | 复用 `POST /api/admin/alumni/upload`。后台提供导入向导（上传 Excel + Zip、展示解析结果与 `upload_batches` 历史）。 |
| 导入历史 | 独立面板查看批次状态、成功/跳过条数、错误日志，支持按上传人筛选。 |

**Server Actions / API 建议**：`createAlumniProfile`、`updateAlumniProfile`、`archiveAlumniProfile`、`uploadAlumniPhoto`，统一返回 `{ success, data?, error? }` 并 `revalidatePath("/admin/alumni")`。

**待确认**：
1. 是否需要更细的角色区分（如仅管理员可删除/归档）？
2. 教育与经历字段是否允许富文本/Markdown？（当前默认纯文本）。

### 8.3 外链资源管理（`/admin/resources`）

| 功能 | 说明 |
| --- | --- |
| 列表 & 过滤 | 展示 `title`、`type`、`year`、`published_at`、`is_featured`、`is_pinned`、`updated_at`；支持类型、年份、置顶状态、关键词筛选。 |
| 新增/编辑 | 表单字段：标题、类型（映射 `resource-types` 常量）、发布日期、链接、简介、年份、`is_featured`、`is_pinned`。 |
| 快捷开关 | 列表内提供 Feature/Pinned Toggle，成功后乐观刷新；失败回滚并提示。 |
| 删除 | 允许硬删除，删除前需确认；操作记录写入 `upload_batches`（`batch_type = manual_entry`，`notes` 记录原标题/链接）。 |
| 批量导入 | CSV 上传入口调用 `POST /api/admin/resources/upload`，上传结束显示成功/跳过/错误条数。 |
| 预览链接 | 每条记录提供“前台跳转”按钮（新窗口打开公众号原文或对应前台模块）。 |

**Server Actions**：`createResource`、`updateResource`、`deleteResource`、`toggleResourceFlags`、`importResources`。

**实现细节**：
- 后台默认按 `published_at DESC, created_at DESC` 排序，与前台消费逻辑保持一致。
- 更新 `src/lib/resource-types.ts` 以驱动表单下拉和 Tag 颜色。

### 8.4 活动媒体管理（`/admin/media`）

| 功能 | 说明 |
| --- | --- |
| Slot 切换 | Tab 在 `home_hero`、`activities_gallery` 间切换，未来可扩展更多 slot。 |
| 列表字段 | 展示缩略图、`title`、`subtitle`、`slot_key`、`sort_order`、`is_active`、`updated_at`。 |
| 新增 | 表单字段：标题、副标题、跳转链接、Slot、排序、状态。图片上传复用标准流程：Server Action -> `media_assets`（包含尺寸/体积）-> `activity_media`，自动压缩到 ≤ 1MB（原图硬性限制 8MB）。 |
| 编辑 | 支持替换图片（插入新 `media_assets` 并更新引用）、修改文案、排序、状态。 |
| 排序/上下线 | 支持拖拽排序或输入排序值；一键切换 `is_active` 控制前台展示。 |
| 删除 | 默认使用停用（`is_active = false`）；彻底删除前需检查 `media_assets` 是否被其他条目引用。 |

**Server Actions**：`createActivityMedia`、`updateActivityMedia`、`deactivateActivityMedia`、`deleteActivityMedia`、`uploadMediaAsset`。

**实现要点**：
- 图片上传沿用统一裁剪压缩 + Supabase Storage，保存后回显缩略图（`/api/media/:assetId`）。
- `/activities` 页面需要根据 `slot_key = activities_gallery` 读取数据；首页 Hero 读取 `slot_key = home_hero`。

### 8.5 页面信息架构

```
/admin
├── layout.tsx        # 左侧导航（学员风采 / 外链资源 / 活动媒体）
├── alumni/page.tsx   # RSC 列表 + Client 表单
├── resources/page.tsx
└── media/page.tsx
```

- 列表通过 Server Components 查询（支持分页参数），表单/弹窗使用 Client 组件触发 Server Actions。
- 公共组件：`AdminShell`、`DataTable`、`FormDialog`、`UploadStepper`、`BatchHistory`。
- 所有成功提交：Toast 提示 + `revalidatePath` + 关闭弹窗；失败则展示 Zod 错误。

### 8.6 待确认事项

1. **鉴权方案**：是否现在就接入 NextAuth/Clerk，或阶段性使用 Basic Auth/Middleware？  
2. **上传容量**：当前导入接口允许 1 GB，需确认部署平台是否支持，如不支持需调整导入策略。  
3. **审计**：除 `upload_batches` 外，是否需要额外的操作日志表记录每次 CRUD？  

---

## 9. 前端展示规则（与缺图相关）

### 9.1 学员头像展示（`alumni_profiles.photo_asset_id`）

- **有头像**（`photo_asset_id` 非空）：
  - 展示圆形头像（或 5:7 竖版裁切容器内的头像区域）。
- **无头像**（`photo_asset_id` 为空）：
  - 展示“无头像卡片”样式：仅展示姓名、期数、行业/职业、简介摘要等；
  - 可用首字母/姓名首字（Placeholder）或统一的默认头像占位，但需要与“有头像”的视觉区分开（例如边框/背景更素）。

> 说明：导入阶段不因缺图丢弃“双愿意”记录，避免丢失文本信息；缺图的同学后续可通过“逐张上传/补图”功能完善。 
