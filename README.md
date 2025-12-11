# Culture China · 晨兴文化中国人才计划

现代化的浙江大学“晨兴文化中国”项目官网，基于 **Next.js 14 App Router + TypeScript + Tailwind + Drizzle ORM** 构建，兼顾品牌叙事与内容运营。

## 核心特性

- ⚙️ **全栈 RSC 架构**：默认 Server Components，Route Handlers 处理 API（如 `/api/health/db`）。
- 🎨 **新中式设计系统**：Tailwind + shadcn/ui，沉稳的晨兴红 / 典雅金配色，磨砂导航 + 雅致页脚。
- 🗄 **类型安全数据层**：Drizzle + PostgreSQL，Zod 校验 `.env`，可直接运行数据库健康检查。
- 🧱 **模块化目录**：严格遵循 `ARCHITECTURE.md` 中的 `src/*` 结构，方便扩展后台、前台与 Server Actions。

## 环境要求

- Node.js ≥ 18（建议 18 LTS 或 20+）
- pnpm（已通过 Corepack 启用）
- Docker（可选，用于快速启动本地 PostgreSQL）

## 快速上手 Quick Start

1. **安装依赖**
   ```bash
   pnpm install
   ```

2. **配置环境变量**
   ```bash
   cp env.example .env
   # 修改 DATABASE_URL，如：
   # postgresql://dev:devpass@localhost:5433/culture_china
   ```

3. **准备数据库**
   - Docker 启动示例（默认监听宿主机 `5433`，避免与系统 PostgreSQL 冲突）：
     ```bash
     docker run --name culture-china-db \
       -e POSTGRES_USER=dev \
       -e POSTGRES_PASSWORD=devpass \
       -e POSTGRES_DB=culture_china \
       -p 5433:5432 -d postgres:15
     ```
   - 若使用本地 PostgreSQL，请自行创建数据库并调整 `.env`。

4. **生成并执行迁移**
   ```bash
   pnpm db:generate   # schema 更新时运行
   pnpm db:migrate    # 迁移到当前数据库
   ```

5. **启动开发服务器**
   ```bash
   pnpm dev
   ```
   访问 `http://localhost:3000`，并通过 `http://localhost:3000/api/health/db` 检查数据库连通性。

## 常用脚本 Scripts

| 命令 | 说明 |
| ---- | ---- |
| `pnpm dev` | 启动 Next.js 开发服务器 |
| `pnpm build && pnpm start` | 生产构建与本地预览 |
| `pnpm lint` | 运行 ESLint（Next.js 集成） |
| `pnpm db:generate` | 基于 `src/db/schema.ts` 生成 Drizzle SQL |
| `pnpm db:migrate` | 执行迁移，保持数据库结构一致 |

## 项目结构 Structure

```
src/
├── app/                    # App Router（含 layout、page、api/health/db 等）
├── components/
│   ├── shared/             # 站点级 Header/Footer 等
│   └── ui/                 # shadcn/ui 基础组件（button 等）
├── db/                     # Drizzle schema
├── lib/
│   ├── db.ts               # Drizzle + postgres 连接
│   ├── env.ts              # Zod 校验的环境变量
│   └── utils.ts            # cn 等工具
```

其余关键文件：

- `drizzle.config.ts`：Drizzle CLI 配置
- `components.json`：shadcn/ui 配置
- `env.example`：环境变量示例
- `dosc/`：背景、规范、功能与任务文档

## 文档索引

- `dosc/basic_rule/ARCHITECTURE.md`：技术架构规范
- `dosc/basic_rule/DESIGH_SYSTEM.md`：视觉与设计系统
- `dosc/plan/FEATURE_LIST.md`：功能规划
- `dosc/task/TODO.md`：阶段性开发进度

欢迎持续根据 TODO 分阶段推进功能，并在每次完成模块后同步更新文档与 git。***
