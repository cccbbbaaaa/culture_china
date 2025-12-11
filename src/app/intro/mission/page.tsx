import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";

export default function MissionPage() {
  return (
    <PageShell>
      <PageHeader
        breadcrumbs={[
          { label: "首页", href: "/" },
          { label: "计划介绍", href: "/intro" },
          { label: "使命背景", href: "/intro/mission" },
        ]}
        subtitle="项目的历史脉络、愿景与精神底色（当前为占位内容）。"
        title="使命背景 / Mission"
      />

      <Section title="计划概览 / Overview">
        <Panel>
          <p className="text-sm leading-relaxed tracking-wide text-ink/80">
            这里将用高质量图文排版呈现项目成立背景、关键人物与愿景。
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            This section will present the program history, key figures, and long-term vision with editorial typography.
          </p>
        </Panel>
      </Section>

      <Section description="建议使用时间轴/里程碑的形式呈现。" title="重要节点 / Milestones">
        <Panel className="border-dashed">
          <ul className="space-y-2 text-sm text-ink/70">
            <li>2008：项目启动（占位）</li>
            <li>201x：关键升级（占位）</li>
            <li>202x：持续发展（占位）</li>
          </ul>
        </Panel>
      </Section>
    </PageShell>
  );
}
