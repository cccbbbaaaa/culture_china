import { PageHeader, PageShell, Panel } from "@/components/shared/page-shell";

export default function IntroFacultyPage() {
  return (
    <PageShell>
      <PageHeader title="师资嘉宾 / Faculty" subtitle="精选导师团队与嘉宾信息将陆续上线。" />
      <Panel>
        <p className="text-base leading-relaxed text-ink/80">
          内容筹备中，后续将展示导师简介、课程参与记录与相关采访。
        </p>
      </Panel>
    </PageShell>
  );
}

