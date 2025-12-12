import { PageHeader, PageShell, Panel } from "@/components/shared/page-shell";

export default function CurriculumNewsPage() {
  return (
    <PageShell>
      <PageHeader title="课程教学 · 新闻场记" subtitle="课堂纪实与教学快讯正在整理。" />
      <Panel>
        <div className="space-y-2 text-base leading-relaxed text-ink/80">
          <p>后续将同步课程新闻、课堂随记与精选图文。</p>
          <p className="text-sm text-ink/65">
            说明：此模块将提供管理后台，定期上传微信公众号推文链接与简介；前台仅展示标题/简介，点击后直接跳转公众号阅读。
            <br />
            Note: This section will be managed via admin; editors upload WeChat article links and summaries, and the page lists them with outbound jump.
          </p>
        </div>
      </Panel>
    </PageShell>
  );
}

