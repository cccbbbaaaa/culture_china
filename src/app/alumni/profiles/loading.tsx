import { PageShell, Panel } from "@/components/shared/page-shell";

export default function Loading() {
  return (
    <PageShell>
      <Panel>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone/30 border-t-primary" />
            <p className="text-sm text-ink/60">加载中 / Loading...</p>
          </div>
        </div>
      </Panel>
    </PageShell>
  );
}


