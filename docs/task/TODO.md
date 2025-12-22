# 项目开发待办清单 (Project Development To-Do List)

> **文档说明** ：本清单基于 `FEATURE_LIST.md` 制定，采用粗颗粒度规划。
> **当前阶段目标** ：完成系统基础架构搭建，实现所有页面的路由连通，跑通核心数据流（后台录入 -> 前台展示）。
> **多语言策略** ：当前优先完成中文版本（默认版本），英文版本将在 Phase 5 实施。
>
> 请在完成每阶段模块更新/代码变更，并通过测试后时，及时更新该文档，并GIT提交代码

## Phase 0: 基础设施初始化 (Infrastructure Setup)

* [x] **项目脚手架搭建**
  * [x] 初始化 Next.js 14+ (App Router) 项目。
  * [x] 配置 Tailwind CSS (录入 `DESIGN_SYSTEM.md` 中的色值与字体)。
  * [x] 安装核心依赖 (`lucide-react`, `shadcn/ui`, `framer-motion`, `zod`).
* [x] **数据库环境准备**
  * [x] 配置 PostgreSQL 数据库连接。
  * [x] 初始化 Drizzle ORM 并建立连接测试（`GET /api/health/db`）。
* [x] **全局布局开发**
  * [x] 实现 **响应式导航栏 (Header)** (磨砂玻璃效果，PC/Mobile 适配)。
  * [x] 实现 **页脚 (Footer)** (包含二维码占位、版权信息)。

## Phase 1: 前端页面骨架 (Frontend Skeleton)

*目标：点击导航栏菜单，能跳转到对应页面，页面有基础的标题和占位符。*

* [x] **首页 (Homepage) 框架**
  * [x] 开发首屏 Hero Banner (预留图片轮播位置)。
  * [x] 搭建 "文化中国介绍"、"近期活动"、"校友师资" 三大板块的容器布局。
* [x] **静态内容页 (Static Pages)**
  * [x] 创建 `/intro/mission`, `/intro/purpose`, `/intro/center` 等静态页面路由。
  * [x] 实现基础的图文排版组件 (Typography Layout)。
* [x] **列表/聚合页 (List Pages)**
  * [x] 搭建 "学员风采" 列表页骨架 (Grid Layout)。
  * [x] 搭建 "特色活动/课程教学" 资讯流骨架 (Card Feed)。
* [x] **招生页 (Admissions)**
  * [x] 创建招生信息展示页。

## Phase 2: 后端与管理后台 (Backend & Admin)

*目标：管理员可以在后台上传 Excel/Zip，同步到数据库并驱动前台展示。*

* [x] **数据库蓝图 (Schema Blueprint)**
  * [x] 撰写 `docs/plan/DATABASE_DESIGN.md`，覆盖 `upload_batches`、`alumni_*`、`external_resources`、`media_assets`、`activity_media` 设计。
* [ ] **Drizzle Schema 落地**
  * [x] 在 `src/db/schema.ts` 中实现/更新上述表结构（含唯一约束与类型）。
  * [x] 为图片处理新增 `media_assets` / `activity_media` 相关类型。
* [ ] **批量上传接口**
  * [x] `POST /api/admin/alumni/upload`：解析 Excel + Zip，完成裁剪压缩与写库（缺图仍入库，`photo_asset_id=NULL`）。
  * [x] `POST /api/admin/resources/upload`：解析 CSV / 表单，支持去重与批次记录。
  * [x] `POST /api/admin/media/activity`：上传轮播图片并写入元数据（含 `slot_key`）。
* [ ] **基础管理后台 (Basic Admin)**
  * [x] 搭建极简的 `/admin` 路由（需简单鉴权/登录态校验）。
  * [ ] 开发 Excel/Zip 上传表单与导入历史列表。
  * [x] 开发外链资源 CRUD 列表视图。
  * [x] 开发活动媒体管理界面（首页轮播 + /activities 图库）。
  * [x] 开发学员风采管理界面（手动录入 / 编辑 / 归档）。

## Phase 3: 数据集成与展示 (Integration)

*目标：前台页面不再显示假数据，而是显示从后台录入的真实（或测试）数据。*

* [ ] **首页数据联调**
  * [ ] 首页 "近期活动动态" 对接数据库查询。
* [x] **列表页数据联调**
  * [x] "学员风采" 对接数据库，实现按期数筛选。
  * [x] "学员风采" 前端支持“缺图样式”：`photo_asset_id` 为空时使用无头像展示形态。
  * [x] "特色活动/课程教学" 对接 `external_resources` 表，实现外链跳转（含分页）。
* [ ] **动态组件优化**
  * [ ] 优化卡片组件 (Resource Card) 的视觉样式（阴影、Hover 效果）。

## Phase 4: 视觉打磨与优化 (Polish)

*待设计细节明确后执行*

* [ ] **视觉精修**
  * [ ] 替换所有占位图片为高质量素材。
  * [ ] 调整字间距、行高，落实 "新中式" 留白设计。
  * [ ] 添加微交互动画 (Framer Motion)。
* [ ] **SEO 与 性能**
  * [ ] 配置 Metadata (Title, Description)。
  * [ ] 检查图片加载性能 (Image Optimization)。

## Phase 5: 多语言支持 (Internationalization)

*目标：在中文版本稳定后，实现英文版本支持。*

* [ ] **多语言架构设计**
  * [ ] 评估并选择 i18n 方案（Next.js 内置路由 vs `next-intl`）。
  * [ ] 设计数据库 Schema 扩展（支持中英双语字段）。
  * [ ] 规划路由结构（`/` 中文默认，`/en/*` 英文版本）。
* [ ] **英文内容准备**
  * [ ] 翻译核心静态页面内容（使命背景、培养宗旨、师资介绍等）。
  * [ ] 准备英文版导航栏、页脚等 UI 文本。
* [ ] **技术实现**
  * [ ] 配置国际化路由与语言检测。
  * [ ] 实现语言切换器组件（导航栏）。
  * [ ] 更新所有组件以支持多语言文本。
  * [ ] 扩展数据库模型以支持双语内容。
* [ ] **测试与优化**
  * [ ] 测试中英文版本切换功能。
  * [ ] 确保 SEO 元数据支持多语言。
  * [ ] 验证外部链接在英文版本中的展示逻辑。

*注：具体每个板块的设计细节（如具体的排版样式、交互特效）将在开发过程中根据实际素材进行迭代。*
