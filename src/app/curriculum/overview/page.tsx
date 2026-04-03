import Link from "next/link";

import { ArrowRight, BookOpen, Clock3, Compass, ScrollText } from "lucide-react";

import { PageEnter } from "@/components/shared/page-enter";
import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";

const UPCOMING_SECTIONS = [
  {
    title: "课程主线梳理",
    description: "按年度主题、核心问题与讨论线索整理课程主轴，帮助访客快速理解项目的知识结构。",
    icon: BookOpen,
  },
  {
    title: "模块与专题结构",
    description: "补齐经典会读、主题研讨、论坛与访学之间的关系，形成完整的课程地图与学习路径。",
    icon: Compass,
  },
  {
    title: "阅读与延伸资料",
    description: "汇总课程大纲、推荐书目、讲座摘要与历史资料入口，方便后续查阅与归档。",
    icon: ScrollText,
  },
] as const;

export default function CurriculumOverviewPage() {
  return (
    <PageShell>
      <PageEnter>
        <PageHeader
          breadcrumbs={[
            { label: "首页", href: "/" },
            { label: "课程教学", href: "/curriculum" },
            { label: "课程介绍", href: "/curriculum/overview" },
          ]}
          subtitle="本页作为课程体系入口继续保留。正式内容正在整理中，后续会补充课程主线、模块设置与历年专题资料。"
          title="课程教学 · 课程介绍"
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.95fr)]">
          <Panel className="relative overflow-hidden border-primary/15 bg-[radial-gradient(circle_at_top_left,rgba(156,99,56,0.18),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(164,120,84,0.14),transparent_38%),linear-gradient(135deg,rgba(255,252,247,0.98),rgba(248,241,231,0.96))]">
            <div className="pointer-events-none absolute -right-10 top-8 hidden h-44 w-44 rounded-full border border-primary/10 bg-canvas/50 blur-2xl lg:block" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.32em] text-primary/70">Under Construction</p>
              <h2 className="mt-4 max-w-3xl font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                课程体系内容正在整理，页面先行保留。
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-ink/75">
                当前阶段先保留栏目入口，避免公开站点出现断链或空白导航。正式上线前，这里会补齐课程结构、年度主题、阅读线索与代表性讲座内容。
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/curriculum">
                    返回课程教学
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/curriculum/news">查看新闻场记</Link>
                </Button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-primary/10 bg-canvas/80 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.26em] text-ink/45">当前状态</p>
                  <p className="mt-3 text-lg font-serif font-semibold text-ink">栏目保留中</p>
                  <p className="mt-2 text-sm leading-6 text-ink/70">导航入口与独立路由继续开放，可稳定访问。</p>
                </div>
                <div className="rounded-2xl border border-primary/10 bg-canvas/80 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.26em] text-ink/45">建设方向</p>
                  <p className="mt-3 text-lg font-serif font-semibold text-ink">课程结构化展示</p>
                  <p className="mt-2 text-sm leading-6 text-ink/70">后续将按主题、模块与年份维度补齐课程资料。</p>
                </div>
                <div className="rounded-2xl border border-primary/10 bg-canvas/80 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.26em] text-ink/45">临时入口</p>
                  <p className="mt-3 text-lg font-serif font-semibold text-ink">先看课程动态</p>
                  <p className="mt-2 text-sm leading-6 text-ink/70">可先通过课程教学首页与新闻场记了解近期公开内容。</p>
                </div>
              </div>
            </div>
          </Panel>

          <div className="grid gap-6">
            <Panel>
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-primary/15 bg-primary/5 p-2 text-primary">
                  <Clock3 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-ink/45">当前说明</p>
                  <p className="mt-1 text-lg font-serif font-semibold text-ink">待建设 / 正在整理</p>
                </div>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-ink/72">
                <li>页面会继续保留，不做下线或跳转处理。</li>
                <li>现阶段先以说明页承接访问，避免看到空白模块或开发占位文案。</li>
                <li>后续补内容时，可在现有结构上直接扩展为正式课程介绍页。</li>
              </ul>
            </Panel>

            <Panel className="border-dashed border-stone/80">
              <p className="text-sm uppercase tracking-[0.28em] text-ink/45">当前可查看</p>
              <div className="mt-4 space-y-3">
                <Link
                  className="group flex items-center justify-between rounded-2xl border border-stone/70 bg-canvas/pure px-4 py-4 transition hover:border-primary/40 hover:bg-primary/5"
                  href="/curriculum"
                >
                  <div>
                    <p className="font-serif text-lg font-semibold text-ink">课程教学首页</p>
                    <p className="mt-1 text-sm text-ink/65">浏览当前公开的课程动态与历次推文。</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-ink/45 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
                <Link
                  className="group flex items-center justify-between rounded-2xl border border-stone/70 bg-canvas/pure px-4 py-4 transition hover:border-primary/40 hover:bg-primary/5"
                  href="/curriculum/news"
                >
                  <div>
                    <p className="font-serif text-lg font-semibold text-ink">新闻场记</p>
                    <p className="mt-1 text-sm text-ink/65">查看课程活动记录、讲座回顾与项目新闻。</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-ink/45 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              </div>
            </Panel>
          </div>
        </div>

        <Section
          description="本页后续将从占位入口升级为完整的课程体系说明页，补齐结构与资料索引。"
          title="后续将补充的内容 / In Progress"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {UPCOMING_SECTIONS.map((item) => {
              const Icon = item.icon;

              return (
                <Panel key={item.title} className="h-full border-stone/80">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/8 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-serif font-semibold text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink/70">{item.description}</p>
                </Panel>
              );
            })}
          </div>
        </Section>
      </PageEnter>
    </PageShell>
  );
}
