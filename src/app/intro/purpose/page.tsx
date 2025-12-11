import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";

export default function PurposePage() {
  return (
    <PageShell>
      <PageHeader
        breadcrumbs={[
          { label: "首页", href: "/" },
          { label: "计划介绍", href: "/intro" },
          { label: "培养宗旨", href: "/intro/purpose" },
        ]}
        subtitle="项目的核心教育理念与培养维度（当前为占位内容）。"
        title="培养宗旨 / Purpose"
      />

      <Section description="视域、情感、观点三维度，形成独特的培养结构。" title="培养维度 / Dimensions">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Panel>
            <h3 className="text-lg font-serif font-semibold text-ink">视域 / Horizon</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">全球化的广度与跨学科视野。</p>
          </Panel>
          <Panel>
            <h3 className="text-lg font-serif font-semibold text-ink">情感 / Emotion</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">对家国文化的深度认同。</p>
          </Panel>
          <Panel>
            <h3 className="text-lg font-serif font-semibold text-ink">观点 / Viewpoint</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">独立思考与批判性思维。</p>
          </Panel>
        </div>
      </Section>

      <Section
        description="认知 → 体验 → 反思 → 笃行（后续可用时间轴组件呈现）。"
        title="教学原则 / Learning Loop"
      >
        <Panel className="border-dashed">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-ink/70">
            <li>认知 Cognition</li>
            <li>体验 Experience</li>
            <li>反思 Reflection</li>
            <li>笃行 Practice</li>
          </ol>
        </Panel>
      </Section>
    </PageShell>
  );
}
