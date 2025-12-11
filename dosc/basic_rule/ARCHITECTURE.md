
## 1. 项目概览 (Overview)

* **架构类型** ：Modern Full-Stack Web Application
* **核心目标** ：构建一个高性能、可扩展、类型安全的现代化 Web 应用。
* **部署环境** ：Vercel (首选) 

## 2. 技术栈 (Tech Stack)

### 2.1 核心框架 (Core)

* **Framework** : Next.js 14+ (App Router)
* **Language** : TypeScript 5+ (Strict Mode)
* **Package Manager** : pnpm

### 2.2 前端 (Frontend)

* **Styling** : Tailwind CSS 3.4+ (使用 Utility-first 原则)
* **Components** : Shadcn/ui (基于 Radix UI)
* **Icons** : Lucide React
* **State Management** :
* Server State: TanStack Query (React Query) 或 Next.js Server Actions
* Global Client State: Zustand (仅在必要时使用，优先利用 URL state 和 Server State)
* **Forms** : React Hook Form + Zod (Validation)

### 2.3 后端与数据 (Backend & Data)

* **API Pattern** : Next.js Server Actions (优先) + Route Handlers (用于 Webhooks/REST)
* **Database** : PostgreSQL
* **ORM** : Drizzle ORM (首选，因其轻量且类型推断强) 或 Prisma
* **Auth** : Clerk / NextAuth.js (Auth.js)

### 2.4 工具与基础设施 (Infra & Tools)

* **Linting** : ESLint + Prettier
* **Date Handling** : date-fns
* **AI Integration** (如果是 AI 应用): Vercel AI SDK

## 3. 目录结构规范 (Directory Structure)

采用基于功能的模块化结构，而非单纯基于文件类型。

```
src/
├── app/                 # Next.js App Router 页面
│   ├── (auth)/          # 认证相关路由组
│   ├── (dashboard)/     # 仪表盘相关路由组
│   ├── api/             # Route Handlers
│   ├── layout.tsx       # Root Layout
│   └── page.tsx         # Landing Page
├── components/          # 组件库
│   ├── ui/              # Shadcn 基础组件 (Button, Input等)
│   ├── shared/          # 跨模块通用组件
│   └── feature-x/       # 特定功能组件 (如非复用)
├── lib/                 # 工具函数与配置
│   ├── db.ts            # 数据库连接
│   ├── utils.ts         # 通用工具
│   └── validators/      # Zod schema 定义
├── server/              # 后端逻辑 (Actions, Queries)
│   ├── actions/         # Server Actions (Mutations)
│   └── queries/         # Data Fetching (Queries)
├── types/               # 全局类型定义
└── db/                  # 数据库 Schema 与 Migration
```

## 4. 开发规范 (Development Guidelines)

### 4.1 组件编写 (Component Principles)

* **Server Components First** : 默认使用服务端组件（RSC）。仅在需要 `useState`, `useEffect`, 或事件监听时添加 `"use client"`。
* **Composition** : 避免创建巨大的单一组件，拆分为小型的、单一职责的组件。
* **Props Interface** : 所有组件必须显式定义 Props 接口，避免使用 `any`。

### 4.2 数据获取 (Data Fetching)

* 在 RSC (Server Components) 中，直接通过 DB/ORM 调用获取数据，不要通过内部 API Route fetch。
* 在 Client Components 中，使用 Server Actions 或 React Query。

### 4.3 样式规范 (Styling)

* 严禁使用 CSS Modules 或 styled-components，**必须**使用 Tailwind CSS。
* 使用 `clsx` 或 `cn` 工具函数处理条件类名。
* 保持响应式设计，优先使用 `sm:`, `md:`, `lg:` 前缀。

### 4.4 错误处理 (Error Handling)

* UI 层使用 `error.tsx` (Error Boundaries)。
* Server Actions 必须返回标准化的 `{ success: boolean, data?: T, error?: string }` 结构，而非直接抛出异常导致页面崩溃。

## 5. 命名约定 (Naming Conventions)

* **Files** : `kebab-case.tsx` (如 `user-profile.tsx`) 或 `PascalCase` (组件文件)。
* **Components** : `PascalCase` (如 `UserProfile`)。
* **Functions** : `camelCase` (如 `getUserById`)。
* **Database** : `snake_case` (表名和字段名)。
