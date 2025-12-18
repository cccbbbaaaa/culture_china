import { PageHeader, PageShell, Panel } from "@/components/shared/page-shell";
import { PageEnter } from "@/components/shared/page-enter";

export default function AlumniStoriesPage() {
  return (
    <PageShell>
      <PageEnter>
        <PageHeader title="校友故事 / Stories" subtitle="精选随笔、专栏与访谈正在整理。" />
        <Panel>
          <p className="text-base leading-relaxed text-ink/80">
            即将上线更多校友故事，敬请期待。
          </p>
        </Panel>
      </PageEnter>
    </PageShell>
  );
}





