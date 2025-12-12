import { PageHeader, PageShell, Panel } from "@/components/shared/page-shell";
import { PageEnter } from "@/components/shared/page-enter";

export default function ActivitiesForumPage() {
  return (
    <PageShell>
      <PageEnter>
        <PageHeader title="特色活动 · 年度论坛" subtitle="年度论坛的主题与精彩瞬间即将上线。" />
        <Panel>
          <div className="space-y-2 text-base leading-relaxed text-ink/80">
            <p>内容筹备中，将呈现论坛议程、嘉宾阵容与精选回顾。</p>
            <p className="text-sm text-ink/65">
              说明：本模块将由后台定期上传微信公众号推文链接与简介，前台只展示标题/简介，点击直接跳转公众号阅读全文。
              <br />
              Note: Managed via admin with WeChat links + summary; front-end lists items and opens the WeChat article on click.
            </p>
          </div>
        </Panel>
      </PageEnter>
    </PageShell>
  );
}

