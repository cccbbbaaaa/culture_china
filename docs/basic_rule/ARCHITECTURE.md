
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

* **Env 管理** : `src/lib/env.ts` 使用 Zod 校验 `process.env`
* **Linting** : ESLint + Next.js `next lint`
* **Date Handling** : date-fns
* **UI 基础** : shadcn/ui（配置见 `components.json`）
* **调试工具** : `/api/health/db` 路由可快速验证数据库连接

## 3. 目录结构规范 (Directory Structure)

采用基于功能的模块化结构，而非单纯基于文件类型。

```
src/
├── app/                     # App Router 页面与 API
│   ├── api/health/db        # 数据库健康检查 Route Handler
│   ├── layout.tsx           # Root layout（含 Header/Footer）
│   └── page.tsx             # 首页占位
├── components/
│   ├── shared/              # Header、Footer 等跨页面组件
│   └── ui/                  # shadcn/ui 基础组件 (button 等)
├── db/                      # Drizzle schema 定义
├── lib/
│   ├── db.ts                # Drizzle + postgres 连接
│   ├── env.ts               # Zod 校验的环境变量
│   └── utils.ts             # cn 等工具函数
```

> 说明：`server/` 与 `types/` 目录可在后续阶段按需补充（如需要自定义 Server Actions 或全局类型）。

## 4. 基础设施现状 (Current Baseline)

* `.env` 基于 `env.example` 配置，必须提供 `DATABASE_URL`
* `drizzle.config.ts` 指向 `src/db/schema.ts`，迁移输出在 `/drizzle`
* Docker PostgreSQL 推荐端口：`5433 -> 5432`（避免与系统实例冲突）
* `components.json` 已初始化，新增 UI 组件时使用 `pnpm dlx shadcn@latest add ...`

## 5. 开发规范 (Development Guidelines)

### 5.1 组件编写 (Component Principles)

* **Server Components First** : 默认使用服务端组件（RSC）。仅在需要 `useState`, `useEffect`, 或事件监听时添加 `"use client"`。
* **Composition** : 避免创建巨大的单一组件，拆分为小型的、单一职责的组件。
* **Props Interface** : 所有组件必须显式定义 Props 接口，避免使用 `any`。

### 5.2 数据获取 (Data Fetching)

* 在 RSC (Server Components) 中，直接通过 DB/ORM 调用获取数据，不要通过内部 API Route fetch。
* 在 Client Components 中，使用 Server Actions 或 React Query。

### 5.3 样式规范 (Styling)

* 严禁使用 CSS Modules 或 styled-components，**必须**使用 Tailwind CSS。
* 使用 `clsx` 或 `cn` 工具函数处理条件类名。
* 保持响应式设计，优先使用 `sm:`, `md:`, `lg:` 前缀。

### 5.4 错误处理 (Error Handling)

* UI 层使用 `error.tsx` (Error Boundaries)。
* Server Actions 必须返回标准化的 `{ success: boolean, data?: T, error?: string }` 结构，而非直接抛出异常导致页面崩溃。

## 6. 命名约定 (Naming Conventions)

* **Files** : `kebab-case.tsx` (如 `user-profile.tsx`) 或 `PascalCase` (组件文件)。
* **Components** : `PascalCase` (如 `UserProfile`)。
* **Functions** : `camelCase` (如 `getUserById`)。
* **Database** : `snake_case` (表名和字段名)。
