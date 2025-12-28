import { PageHeader, PageShell, Panel } from "@/components/shared/page-shell";
import { PageEnter } from "@/components/shared/page-enter";

export default function CurriculumOverviewPage() {
  return (
    <PageShell>
      <PageEnter>
        <PageHeader title="课程教学 · 课程介绍" subtitle="历史课程与模块介绍即将发布。" />
        <Panel>
          <p className="text-base leading-relaxed text-ink/80">
            内容筹备中，将汇总课程大纲、教学模块与重要主题。
          </p>
        </Panel>
      </PageEnter>
    </PageShell>
  );
}







