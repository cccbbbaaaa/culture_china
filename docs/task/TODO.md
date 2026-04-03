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

* [x] **首页 (Homepage) 框架**
  * [x] 开发首屏 Hero Banner (预留图片轮播位置)。
  * [x] 搭建 "文化中国介绍"、"近期活动"、"校友师资" 三大板块的容器布局。
* [x] **静态内容页 (Static Pages)**
  * [x] 创建 `(intro)/mission`, `(intro)/purpose`, `(intro)/faculty`, `(intro)/zhou` 等静态页面路由。
  * [x] 实现基础的图文排版组件 (Typography Layout)。
* [x] **列表/聚合页 (List Pages)**
  * [x] 搭建 "学员风采" 列表页骨架 (Grid Layout)。
  * [x] 搭建 "特色活动/课程教学" 资讯流骨架 (Card Feed)。
* [x] **招生页 (Admissions)**
  * [x] 创建招生信息展示页。

## Phase 2: 后端与管理后台 (Backend & Admin)

*目标：管理员可以登录后台，录入一个“外部链接”，并能在数据库中看到。*

* [x] **数据库模型设计 (Schema Design)**
  * [x] 设计 `resources` 表 (用于存储外部文章链接/新闻/活动)。
  * [x] 设计 `alumni` 表 (用于存储学员信息)。
  * [x] 设计 `faculty` 表 (用于存储师资信息)。
* [x] **基础管理后台 (Basic Admin)**
  * [x] 搭建极简的 `/admin` 路由（需简单鉴权）。
  * [x] 开发 **"外部资源录入" 表单** (输入标题、URL、简介、分类)。
  * [x] 开发 **资源列表管理** (增删改查)。

## Phase 3: 数据集成与展示 (Integration)

*目标：前台页面不再显示假数据，而是显示从后台录入的真实（或测试）数据。*

* [x] **首页数据联调**
  * [x] 首页 "近期活动动态" 对接数据库查询。
* [x] **列表页数据联调**
  * [x] "学员风采" 对接数据库，实现按期数筛选。
  * [x] "特色活动/课程教学" 对接 `resources` 表，实现外链跳转。
* [x] **动态组件优化**
  * [x] 优化卡片组件 (Resource Card) 的视觉样式（阴影、Hover 效果）。

## Phase 4: 视觉打磨与优化 (Polish)

> **审查时间**：2026-04-03，通过无头浏览器截图全站所有页面进行视觉审查，发现以下问题，按优先级排列。
> **并行开发说明**：各 Task 之间基本无依赖，可分配给不同 agent 并行执行，但注意下方文件冲突说明。

---

### Git Checkpoint 协议（所有 sub-agent 必须遵守）

每个 agent 在完成任务前**必须**执行以下步骤，严禁跳过：

```bash
# 1. 修改完成后先做类型检查，确保无 TS 错误
pnpm typecheck

# 2. 类型检查通过后，创建原子 commit（一个 Task 一个 commit）
git add <涉及的文件>
git commit -m "<type>: <中文描述>"

# commit message 规范（参考已有历史）：
# fix: 清除特色活动页面开发者注释
# fix: 统一学员风采无照片卡片样式
# fix: 优化师资嘉宾页面布局与分组标题
# feat: 补全全站 SEO metadata
# fix: 优化首页移动端 Hero 副标题字号
```

**重要原则**：
- 修改前先 `git status` 确认工作区干净
- 每次只提交本 Task 涉及的文件，不捎带无关改动
- 若 `pnpm typecheck` 失败，修复后再提交，**不得带着 TS 错误提交**
- Task D 体量大（18个文件），建议分两次 commit：先 `layout.tsx`，再所有 page 文件

**文件冲突警告**：
- `src/app/intro/faculty/page.tsx` 同时被 **Task C**（布局调整）和 **Task D**（添加 metadata）修改
- 解决方案：Task C 执行完 commit 后，Task D 再 pull/rebase 并在同文件追加 metadata，或由同一 agent 串行完成这两个文件

---

---

### Task A — 清除开发者注释（P0，立即修复）

**问题**：以下文字是开发阶段的内部注释，直接暴露给了真实用户，需立即清除或替换。

| 文件 | 行号 | 当前内容 | 处理方式 |
|---|---|---|---|
| `src/app/activities/page.tsx` | 40 | `subtitle="展现项目活力与对外交流成果；图片可作为图库入口（当前为骨架占位）。"` | 删除"（当前为骨架占位）"，改为：`"展现项目活力与对外交流成果。"` |
| `src/app/activities/page.tsx` | 44 | Section description `"内容由运维后台「活动媒体管理 · /activities 图库」维护。"` | 删除 description prop |
| `src/app/activities/page.tsx` | 50 | Section description `"已与 external_resources 表对接，可通过后台推文控制展示与排序。"` | 删除 description prop |
| `src/app/curriculum/page.tsx` | 49–54 | `<Section title="课程介绍 / Overview"><Panel>预留：按年份归档课程大纲、师资与阅读清单等。</Panel></Section>` | 整个 Section 块删除（内容未就绪，不应上线） |

**操作方案**：
```
文件：src/app/activities/page.tsx
- 第40行 subtitle 末尾删除 "；图片可作为图库入口（当前为骨架占位）"
- 第44行 <Section> 删除 description prop
- 第50行 <Section> 删除 description prop

文件：src/app/curriculum/page.tsx
- 删除整个 <Section title="课程介绍 / Overview">...</Section> 块（约第49–55行）
```

* [ ] 修复 `src/app/activities/page.tsx` 3处开发注释
* [ ] 删除 `src/app/curriculum/page.tsx` 中 "课程介绍/Overview" 空白占位 Section

---

### Task B — 学员风采卡片视觉统一（P1）

**问题**：有照片与无照片学员的卡片样式差异过大，形成明显视觉割裂感。
- 有照片卡片：实线边框 `border-stone`、大图、`text-xl` 姓名，显得正式
- 无照片卡片：虚线边框 `border-dashed`（像占位符）、`text-sm` 姓名、整体像未完成状态

**文件**：`src/components/alumni/alumni-card-list.tsx`，第108–151行（noPhotoCards 渲染部分）

**操作方案**：
```
将无照片卡片的样式从"占位符风格"改为"正式列表风格"：
- border-dashed border-stone → border border-stone/60（实线，略淡）
- text-sm font-medium → text-base font-serif font-semibold（与有照片卡片姓名字号接近）
- text-xs → text-sm（期数/专业信息字号）
- p-4 → p-5（增加内边距，提升质感）
```

同时，`src/app/alumni/profiles/page.tsx` 第66行 Section description：
```
"有照片学员优先展示；无照片学员会统一排列在列表底部（不影响入库）。"
→ 删除此 description（技术性说明，非用户信息）
```

* [ ] 优化无照片学员卡片样式，与有照片卡片视觉档次一致
* [ ] 删除学员风采页面中面向开发者的 Section description

---

### Task C — 师资嘉宾页面优化（P1）

**问题**：`src/app/intro/faculty/page.tsx`
1. 5位有照片导师用3列网格，末行2人靠左，排列不对称
2. Section description "部分导师简介。" 过于简陋
3. 有照片导师（卡片）vs 访问学者（纯文字列表）两种展示风格落差大，但缺乏清晰的分组标题区分

**操作方案**：
```
1. 将导师网格从 md:grid-cols-3 改为以下策略：
   5人 → grid-cols-2 md:grid-cols-3，最后一行单独居中（用 col-span + justify-center 处理奇数尾行）
   或更简单：改为 grid-cols-2 md:grid-cols-2 lg:grid-cols-3

2. Section description 改为：
   "以下为部分常驻导师简介，点击姓名可查看详细介绍。"

3. 访问学者部分加独立 <Section> 或 <h3> 标题，与常驻导师明确区分：
   建议在 visitingFaculty 列表前加：
   <h3 className="mt-10 mb-4 font-serif text-xl font-semibold text-ink">访问学者 / Visiting Faculty</h3>
```

* [ ] 修复导师网格末行不对称问题
* [ ] 改写 Section description 为用户友好文字
* [ ] 为访问学者列表添加清晰的分组标题

---

### Task D — 全站 SEO Metadata 补全（P2）

**现状**（已核实）：
- `src/app/layout.tsx:40` 已有全局 metadata：`title: "晨兴文化中国人才计划"`，`description: "Morningside Cultural China Scholars Program"`
- 缺少 `title.template`，导致子页面 title 无法自动拼接站点名
- description 为纯英文，与中文优先策略不符
- 经 `find src/app -name "page.tsx"` 实际清点，**公开页面共 17 个**，全部无页面级 metadata

**第一步：升级 `src/app/layout.tsx` 全局 metadata**

```typescript
export const metadata: Metadata = {
  title: {
    default: "晨兴文化中国人才计划",
    template: "%s | 晨兴文化中国",   // 子页面自动拼接
  },
  description: "浙江大学晨兴文化中国学者计划——培养秉承中华文化之精神、具有全球视野的未来社会领袖人才。",
  icons: { icon: "/images/branding/icon.svg", shortcut: "/images/branding/icon.svg", apple: "/images/branding/icon.svg" },
};
```

**第二步：各公开页面 metadata matrix（执行时逐行补全）**

| 文件路径 | title（填入 template %s 位） | description |
|---|---|---|
| `src/app/page.tsx` | （首页用 default，无需 title） | 同全局 |
| `src/app/intro/page.tsx` | `计划介绍` | 了解浙大晨兴文化中国学者计划的使命、课程与师资体系。 |
| `src/app/intro/mission/page.tsx` | `使命背景` | 项目发起历史、核心使命与培养理念。 |
| `src/app/intro/purpose/page.tsx` | `培养宗旨` | 以文化为纽带，培养兼具人文底蕴与全球视野的青年领袖。 |
| `src/app/intro/faculty/page.tsx` | `师资嘉宾` | 常驻导师与历届访问学者名录。 |
| `src/app/intro/zhou/page.tsx` | `周老师专栏` | 周生春教授专栏文章与讲座精选。 |
| `src/app/alumni/page.tsx` | `学员风采` | 各期学员风采与校友故事。 |
| `src/app/alumni/profiles/page.tsx` | `各期学员` | 按届次浏览历届文化中国学员名录。 |
| `src/app/alumni/stories/page.tsx` | `校友故事` | 校友随笔、访谈与专栏精选。 |
| `src/app/activities/page.tsx` | `特色活动` | 年度论坛、访学交流等特色活动回顾。 |
| `src/app/activities/forum/page.tsx` | `年度论坛` | 文化中国年度论坛历届回顾与精选推文。 |
| `src/app/activities/visits/page.tsx` | `访学交流` | 国内外访学交流活动精彩瞬间。 |
| `src/app/activities/others/page.tsx` | `其他活动` | 文化中国系列其他主题活动。 |
| `src/app/curriculum/page.tsx` | `课程教学` | 历届课程新闻场记与精选讲座。 |
| `src/app/curriculum/news/page.tsx` | `新闻场记` | 课程活动记录与新闻推文。 |
| `src/app/curriculum/overview/page.tsx` | `课程介绍` | 文化中国课程体系介绍。 |
| `src/app/admissions/page.tsx` | `招生信息` | 报名条件、招生流程与时间安排。 |

> Admin 路由（`src/app/admin/**`）无需配置公开 metadata，跳过。

* [ ] 升级 `src/app/layout.tsx`：添加 `title.template`，description 改为中文
* [ ] 按 matrix 为 17 个公开页面补全 `export const metadata`

---

### Task E — 首页移动端 Hero 副标题优化（P2）

**问题**：Hero 副标题 "培养秉承中华文化之精神、具有全球视野的未来社会各界领袖人才" 在移动端（390px）换行效果差，文字过密。

**文件**：`src/app/page.tsx`，约第142行

**操作方案**：
```
方案1：缩短文字为 "培养具有全球视野的未来社会领袖人才"
方案2：保持原文，但在移动端隐藏（hidden sm:block）
方案3：给 <span> 添加 text-base sm:text-lg 调整移动端字号
```
推荐方案3，不删减内容，仅调整字号。

* [ ] 优化首页移动端 Hero 副标题的可读性

---

### 已完成的 Phase 4 其他项

* [ ] **视觉精修**
  * [ ] 替换所有占位图片为高质量素材。
  * [ ] 调整字间距、行高，落实 "新中式" 留白设计。
  * [ ] 添加微交互动画 (Framer Motion)。
* [ ] **SEO 与 性能**
  * [ ] 配置 Metadata (Title, Description)。← 见 Task D
  * [ ] 检查图片加载性能 (Image Optimization)。

*注：具体每个板块的设计细节（如具体的排版样式、交互特效）将在开发过程中根据实际素材进行迭代。*
