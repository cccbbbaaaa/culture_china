import { PageHeader, PageShell, Panel } from "@/components/shared/page-shell";
import { PageEnter } from "@/components/shared/page-enter";

export default function IntroZhouColumnPage() {
  return (
    <PageShell>
      <PageEnter>
        <PageHeader title="周老师专栏" subtitle="精选专栏文章与观点将于此处发布。" />
        <Panel>
          <p className="text-base leading-relaxed text-ink/80">
            正在收集内容，后续会同步周老师的最新随笔、课堂摘录与思考。
          </p>
        </Panel>
      </PageEnter>
    </PageShell>
  );
}

