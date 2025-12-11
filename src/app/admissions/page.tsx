import Image from "next/image";

import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";

interface TimelineStep {
  title: string;
  description: string;
}

export default function AdmissionsPage() {
  const steps: TimelineStep[] = [
    { title: "关注信息 / Follow", description: "关注公众号获取当年招生与宣讲信息。" },
    { title: "报名申请 / Apply", description: "按要求提交报名材料（占位）。" },
    { title: "选拔面试 / Interview", description: "项目组综合评估，择优录取（占位）。" },
    { title: "入选培养 / Program", description: "参与课程、活动与导师制培养。" },
  ];

  return (
    <PageShell>
      <PageHeader
        breadcrumbs={[{ label: "首页", href: "/" }, { label: "招生信息", href: "/admissions" }]}
        subtitle="极简信息引导，转化流量至私域；当前为骨架占位。"
        title="招生信息 / Admissions"
      />

      <Section description="用时间轴清晰呈现：要求、流程、时间表。" title="招生流程 / Timeline">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {steps.map((step) => (
            <Panel key={step.title}>
              <h3 className="text-lg font-serif font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.description}</p>
            </Panel>
          ))}
        </div>
      </Section>

      <Section description="突出公众号二维码与咨询方式（后续替换为真实二维码）。" title="关注引导 / CTA">
        <Panel>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="relative h-28 w-28 overflow-hidden rounded border border-stone">
              <Image alt="公众号二维码占位 / WeChat QR placeholder" fill sizes="112px" src="/images/branding/icon.jpg" />
            </div>
            <div>
              <p className="text-sm leading-relaxed text-ink/80">扫码关注获取最新招生动态与咨询入口。</p>
              <p className="mt-2 text-sm text-ink/60">Scan to follow and get the latest admissions updates.</p>
            </div>
          </div>
        </Panel>
      </Section>
    </PageShell>
  );
}
