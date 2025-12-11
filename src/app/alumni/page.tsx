import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";

export default function AlumniPage() {
  return (
    <PageShell>
      <PageHeader
        breadcrumbs={[{ label: "首页", href: "/" }, { label: "学员风采", href: "/alumni" }]}
        subtitle="按期数筛选学员名录，并展示校友故事/随笔（当前为骨架占位）。"
        title="学员风采 / Alumni Showcase"
      />

      <Section
        description="后续将对接 alumni 表，实现：期数筛选、搜索、详情页等。"
        title="学员名录 / Directory"
      >
        <Panel className="border-dashed">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-stone/60 px-3 py-1 text-xs text-ink/70">筛选：第 1 期</span>
            <span className="rounded-full bg-stone/60 px-3 py-1 text-xs text-ink/70">筛选：第 2 期</span>
            <span className="rounded-full bg-stone/60 px-3 py-1 text-xs text-ink/70">筛选：第 3 期</span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-stone bg-canvas/pure p-5 shadow-sm">
                <p className="text-sm font-medium text-ink">学员姓名 {index + 1}</p>
                <p className="mt-1 text-xs text-ink/60">第 X 期 · 专业/学院 · 去向（占位）</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">个人简介占位：一句话描述其研究/行业方向。</p>
              </div>
            ))}
          </div>
        </Panel>
      </Section>

      <Section description="一部分为外链跳转，一部分为固定 blog（后续实现）。" title="校友故事 / Stories">
        <Panel className="border-dashed">
          <p className="text-sm text-ink/70">预留：故事列表、标签、跳转微信公众号等。</p>
        </Panel>
      </Section>
    </PageShell>
  );
}
