# 项目开发待办清单 (Project Development To-Do List)

> **文档说明** ：本清单基于 `FEATURE_LIST.md` 制定，采用粗颗粒度规划。
> **当前阶段目标** ：完成系统基础架构搭建，实现所有页面的路由连通，跑通核心数据流（后台录入 -> 前台展示）。
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

* [ ] **首页 (Homepage) 框架**
  * [ ] 开发首屏 Hero Banner (预留图片轮播位置)。
  * [ ] 搭建 "文化中国介绍"、"近期活动"、"校友师资" 三大板块的容器布局。
* [ ] **静态内容页 (Static Pages)**
  * [ ] 创建 `(intro)/mission`, `(intro)/purpose`, `(intro)/center` 等静态页面路由。
  * [ ] 实现基础的图文排版组件 (Typography Layout)。
* [ ] **列表/聚合页 (List Pages)**
  * [ ] 搭建 "学员风采" 列表页骨架 (Grid Layout)。
  * [ ] 搭建 "特色活动/课程教学" 资讯流骨架 (Card Feed)。
* [ ] **招生页 (Admissions)**
  * [ ] 创建招生信息展示页。

## Phase 2: 后端与管理后台 (Backend & Admin)

*目标：管理员可以登录后台，录入一个“外部链接”，并能在数据库中看到。*

* [ ] **数据库模型设计 (Schema Design)**
  * [ ] 设计 `resources` 表 (用于存储外部文章链接/新闻/活动)。
  * [ ] 设计 `alumni` 表 (用于存储学员信息)。
  * [ ] 设计 `faculty` 表 (用于存储师资信息)。
* [ ] **基础管理后台 (Basic Admin)**
  * [ ] 搭建极简的 `/admin` 路由（需简单鉴权）。
  * [ ] 开发 **"外部资源录入" 表单** (输入标题、URL、简介、分类)。
  * [ ] 开发 **资源列表管理** (增删改查)。

## Phase 3: 数据集成与展示 (Integration)

*目标：前台页面不再显示假数据，而是显示从后台录入的真实（或测试）数据。*

* [ ] **首页数据联调**
  * [ ] 首页 "近期活动动态" 对接数据库查询。
* [ ] **列表页数据联调**
  * [ ] "学员风采" 对接数据库，实现按期数筛选。
  * [ ] "特色活动/课程教学" 对接 `resources` 表，实现外链跳转。
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

*注：具体每个板块的设计细节（如具体的排版样式、交互特效）将在开发过程中根据实际素材进行迭代。*
