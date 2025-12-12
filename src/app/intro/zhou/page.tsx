import { PageHeader, PageShell, Panel } from "@/components/shared/page-shell";

export default function IntroZhouColumnPage() {
  return (
    <PageShell>
      <PageHeader title="周老师专栏" subtitle="精选专栏文章与观点将于此处发布。" />
      <Panel>
        <p className="text-base leading-relaxed text-ink/80">
          正在收集内容，后续会同步周老师的最新随笔、课堂摘录与思考。
        </p>
      </Panel>
    </PageShell>
  );
}

