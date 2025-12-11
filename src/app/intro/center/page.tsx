import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";

export default function CenterPage() {
  return (
    <PageShell>
      <PageHeader
        breadcrumbs={[
          { label: "首页", href: "/" },
          { label: "计划介绍", href: "/intro" },
          { label: "儒商中心", href: "/intro/center" },
        ]}
        subtitle="儒商中心相关介绍与资源导览（当前为占位内容）。"
        title="儒商中心 / Center"
      />

      <Section title="中心简介 / About">
        <Panel>
          <p className="text-sm leading-relaxed tracking-wide text-ink/80">
            这里将展示中心定位、相关项目与合作资源入口。
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            This page will provide an overview of the center and relevant resources.
          </p>
        </Panel>
      </Section>

      <Section description="后续可对接资源库（resources）并分类展示。" title="资源入口 / Resources">
        <Panel className="border-dashed">
          <p className="text-sm text-ink/70">预留：专题链接、报告下载、活动回顾等。</p>
        </Panel>
      </Section>
    </PageShell>
  );
}
