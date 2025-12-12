<div align="center">

![文化中国 Logo](./public/images/branding/logo.png)

# Cultural China · 晨兴文化中国人才计划

**Zhejiang University Morningside Cultural China Scholars Program**

现代化的项目官网，基于 **Next.js 14 App Router + TypeScript + Tailwind + Drizzle ORM** 构建

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📋 目录

- [项目概览](#项目概览)
- [技术架构](#技术架构)
- [快速上手](#快速上手)
- [项目结构](#项目结构)
- [开发规范](#开发规范)
- [文档索引](#文档索引)

---

## 🎯 项目概览

**浙江大学晨兴文化中国人才计划**是一个非学分制、精英化的跨学科教育项目，旨在培养具有全球视野且认同中华传统文化的未来领袖。

本项目为其官方网站，采用**混合内容策略**：

- **核心静态内容**：本地化存储（使命背景、培养宗旨、师资名录等）
- **时效性内容**：通过外部链接引用微信公众号推文（新闻、活动、随笔）
- **多语言支持**：支持中英双语版本（当前优先完成中文版本，英文版本待 Phase 5 实施）

### 核心特性

- ⚙️ **全栈 RSC 架构**：默认 Server Components，Route Handlers 处理 API
- 🎨 **新中式设计系统**：Tailwind + shadcn/ui，沉稳的晨兴红 / 典雅金配色
- 🗄 **类型安全数据层**：Drizzle ORM + PostgreSQL，Zod 校验环境变量
- 🧱 **模块化目录**：基于功能的清晰结构，便于扩展后台与前台功能

---

## 🏗️ 技术架构

### 系统架构图

```mermaid
graph TB
    subgraph "前端层 Frontend"
        A[Next.js App Router] --> B[Server Components]
        A --> C[Client Components]
        B --> D[直接 DB 查询]
        C --> E[Server Actions]
        C --> F[API Routes]
    end
  
    subgraph "UI 层 UI Layer"
        G[Tailwind CSS] --> H[shadcn/ui]
        H --> I[自定义组件]
    end
  
    subgraph "数据层 Data Layer"
        J[Drizzle ORM] --> K[PostgreSQL]
        J --> L[Zod 校验]
    end
  
    D --> J
    E --> J
    F --> J
  
    style A fill:#962E2A,color:#fff
    style J fill:#E2BA3E,color:#000
    style K fill:#1F2937,color:#fff
```

### 数据流架构

```mermaid
sequenceDiagram
    participant User as 用户
    participant RSC as Server Component
    participant DB as Database
    participant CC as Client Component
    participant SA as Server Action
  
    User->>RSC: 访问页面
    RSC->>DB: 直接查询数据
    DB-->>RSC: 返回数据
    RSC-->>User: 渲染页面
  
    User->>CC: 交互操作
    CC->>SA: 调用 Server Action
    SA->>DB: 数据变更
    DB-->>SA: 返回结果
    SA-->>CC: 更新状态
    CC-->>User: 反馈结果
```

### 技术栈组成

```mermaid
mindmap
  root((技术栈))
    前端
      Next.js 14 App Router
      TypeScript 5+
      Tailwind CSS 3.4
      shadcn/ui
      Framer Motion
      Lucide React
    后端
      Server Components
      Server Actions
      Route Handlers
      Drizzle ORM
      PostgreSQL
      Zod 校验
    工具链
      pnpm
      ESLint
      Drizzle Kit
      date-fns
```

### 目录结构详解

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── health/db/            # 数据库健康检查
│   ├── intro/                    # 计划介绍相关页面
│   │   ├── mission/              # 使命背景
│   │   ├── purpose/              # 培养宗旨
│   │   └── center/               # 儒商中心
│   ├── activities/                # 特色活动
│   ├── admissions/               # 招生信息
│   ├── alumni/                   # 学员风采
│   ├── curriculum/               # 课程教学
│   ├── layout.tsx                # 根布局（Header/Footer）
│   ├── page.tsx                  # 首页
│   └── globals.css               # 全局样式
│
├── components/
│   ├── home/                     # 首页专用组件
│   │   └── hero-carousel.tsx     # 轮播组件
│   ├── shared/                   # 跨页面共享组件
│   │   ├── header.tsx            # 导航栏
│   │   ├── footer.tsx            # 页脚
│   │   ├── page-shell.tsx        # 页面容器/标题/分区
│   │   ├── page-enter.tsx        # 页面进入动画
│   │   ├── image-lightbox.tsx    # 图片放大预览
│   │   └── entry-gate.tsx        # 开屏遮罩（已禁用）
│   └── ui/                       # shadcn/ui 基础组件
│       └── button.tsx
│
├── db/
│   └── schema.ts                 # Drizzle 数据模型
│       ├── resources              # 外部资源（新闻/活动）
│       ├── alumni                 # 学员信息
│       └── faculty                # 师资信息
│
└── lib/
    ├── db.ts                     # 数据库连接
    ├── env.ts                    # 环境变量校验（Zod）
    └── utils.ts                  # 工具函数（cn 等）
```

### 核心设计原则

1. **Server Components First**：默认服务端组件，仅在需要交互时使用 `"use client"`
2. **类型安全**：TypeScript Strict Mode + Zod 运行时校验
3. **模块化**：基于功能组织代码，而非文件类型
4. **DRY 原则**：复用组件与工具函数，避免重复代码

---

## 🚀 快速上手

### 环境要求

- **Node.js** ≥ 18（建议 18 LTS 或 20+）
- **pnpm**（已通过 Corepack 启用）
- **Docker**（可选，用于快速启动本地 PostgreSQL）

### 安装步骤

1. **克隆仓库并安装依赖**

   ```bash
   git clone <repository-url>
   cd culture_china/project
   pnpm install
   ```
2. **配置环境变量**

   ```bash
   cp env.example .env
   ```

   编辑 `.env`，设置数据库连接：

   ```env
   # 本地开发
   DATABASE_URL=postgresql://dev:devpass@localhost:5433/culture_china

   # 或 Vercel Postgres（自动提供 POSTGRES_URL）
   # POSTGRES_URL=postgres://...
   ```
3. **启动数据库**（Docker 示例）

   ```bash
   docker run --name culture-china-db \
     -e POSTGRES_USER=dev \
     -e POSTGRES_PASSWORD=devpass \
     -e POSTGRES_DB=culture_china \
     -p 5433:5432 -d postgres:15
   ```
4. **执行数据库迁移**

   ```bash
   pnpm db:generate   # 基于 schema.ts 生成 SQL
   pnpm db:migrate   # 执行迁移
   ```
5. **启动开发服务器**

   ```bash
   pnpm dev
   ```

   访问 `http://localhost:3000`，并通过 `http://localhost:3000/api/health/db` 检查数据库连通性。

### 常用命令

| 命令                 | 说明                                |
| -------------------- | ----------------------------------- |
| `pnpm dev`         | 启动开发服务器（热重载）            |
| `pnpm build`       | 生产构建                            |
| `pnpm start`       | 本地预览生产构建                    |
| `pnpm lint`        | 运行 ESLint                         |
| `pnpm db:generate` | 生成 Drizzle 迁移文件               |
| `pnpm db:migrate`  | 执行数据库迁移                      |
| `pnpm db:studio`   | 打开 Drizzle Studio（可视化数据库） |

### EdgeOne / 纯静态托管注意事项

如果需要将站点部署到 **EdgeOne Pages** 或其他仅提供静态托管的 CDN，需要禁用 Next.js 自带的图片优化（该能力依赖 Node 运行时，静态托管上不可用），否则 `next/image` 会请求 404 的 `/_next/image` 接口。

**做法：**

```bash
# 构建 EdgeOne 版本
NEXT_PUBLIC_EDGE_DEPLOY=true pnpm build
```

该环境变量会在构建阶段设置 `images.unoptimized=true`，使所有图片直接引用 `public/` 资源，EdgeOne 即可正常显示。Vercel 正常构建时无需设置，继续享受原生图片优化。

---

## 📁 项目结构

### 完整目录树

```
culture_china/project/
├── public/
│   └── images/                  # 静态资源
│       ├── branding/            # Logo、Banner、Icon
│       ├── events/              # 活动图片
│       └── people/              # 人员照片
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── api/                 # API Routes
│   │   ├── intro/               # 计划介绍页面
│   │   ├── activities/          # 特色活动
│   │   ├── admissions/          # 招生信息
│   │   ├── alumni/              # 学员风采
│   │   ├── curriculum/          # 课程教学
│   │   ├── layout.tsx           # 根布局
│   │   ├── page.tsx             # 首页
│   │   └── globals.css          # 全局样式
│   │
│   ├── components/
│   │   ├── home/                # 首页组件
│   │   ├── shared/              # 共享组件
│   │   └── ui/                  # UI 基础组件
│   │
│   ├── db/
│   │   └── schema.ts            # Drizzle 数据模型
│   │
│   └── lib/
│       ├── db.ts                 # 数据库连接
│       ├── env.ts                # 环境变量校验
│       └── utils.ts              # 工具函数
│
├── docs/                         # 项目文档
│   ├── background/              # 背景介绍
│   ├── basic_rule/              # 规范文档
│   ├── plan/                    # 功能规划
│   └── task/                    # 任务清单
│
├── drizzle.config.ts             # Drizzle 配置
├── components.json               # shadcn/ui 配置
├── tailwind.config.ts            # Tailwind 配置
├── tsconfig.json                 # TypeScript 配置
└── package.json                  # 项目依赖
```

### 关键文件说明

| 文件/目录                  | 说明                                       |
| -------------------------- | ------------------------------------------ |
| `src/app/`               | Next.js App Router 路由与页面              |
| `src/components/shared/` | 跨页面共享组件（Header/Footer/PageShell）  |
| `src/components/home/`   | 首页专用组件（HeroCarousel）               |
| `src/db/schema.ts`       | 数据库模型定义（resources/alumni/faculty） |
| `src/lib/env.ts`         | 环境变量 Zod 校验（支持 Vercel Postgres）  |
| `drizzle.config.ts`      | Drizzle CLI 配置                           |
| `components.json`        | shadcn/ui 组件配置                         |

---

## 🎨 开发规范

### 组件编写原则

- **Server Components First**：默认服务端组件，仅在需要 `useState`/`useEffect`/事件监听时使用 `"use client"`
- **Composition**：拆分大型组件为小型、单一职责的组件
- **Props Interface**：显式定义 Props 接口，禁止 `any`

### 数据获取策略

```mermaid
graph LR
    A[Server Component] -->|直接查询| B[Database]
    C[Client Component] -->|调用| D[Server Action]
    C -->|或| E[API Route]
    D --> B
    E --> B
```

### 样式规范

- **必须使用 Tailwind CSS**，禁止 CSS Modules / styled-components
- 使用 `cn()` 工具函数合并条件类名
- 类名排序：布局 → 盒模型 → 排版 → 视觉 → 其他

### 错误处理

- UI 层：使用 `error.tsx`（Error Boundaries）
- Server Actions：返回 `{ success: boolean, data?: T, error?: string }`

---

## 📚 文档索引

| 文档                                                                    | 说明           |
| ----------------------------------------------------------------------- | -------------- |
| [`docs/basic_rule/ARCHITECTURE.md`](./docs/basic_rule/ARCHITECTURE.md)   | 技术架构规范   |
| [`docs/basic_rule/DESIGH_SYSTEM.md`](./docs/basic_rule/DESIGH_SYSTEM.md) | 视觉与设计系统 |
| [`docs/plan/FEATURE_LIST.md`](./docs/plan/FEATURE_LIST.md)               | 功能规划清单   |
| [`docs/task/TODO.md`](./docs/task/TODO.md)                               | 阶段性开发进度 |
| [`docs/background/intro.md`](./docs/background/intro.md)                 | 项目背景介绍   |

---

## 🔄 开发流程

### 典型工作流

```mermaid
graph TD
    A[开发功能] --> B[运行 pnpm lint]
    B --> C{通过?}
    C -->|否| D[修复错误]
    D --> B
    C -->|是| E[更新 TODO.md]
    E --> F[Git Commit]
    F --> G[可选: Git Push]
```

### 当前开发阶段

根据 `docs/task/TODO.md`，当前处于 **Phase 1**（前端页面骨架）已完成，**Phase 2**（后端与管理后台）待开发。

---

## 📝 贡献指南

1. 遵循项目规范（见 `docs/basic_rule/`）
2. 完成模块后更新 `docs/task/TODO.md`
3. 提交前运行 `pnpm lint` 确保代码质量
4. 使用清晰的 commit message

---

<div align="center">

**© 2025 浙江大学晨兴文化中国人才计划**

</div>
