import { PageHeader, PageShell, Panel } from "@/components/shared/page-shell";
import { PageEnter } from "@/components/shared/page-enter";

export default function ActivitiesOthersPage() {
  return (
    <PageShell>
      <PageEnter>
        <PageHeader title="特色活动 · 其他" subtitle="更多文化交流、工作坊与主题活动将集中展示。" />
        <Panel>
          <div className="space-y-2 text-base leading-relaxed text-ink/80">
            <p>内容筹备中，稍后将补充更多活动回顾与图文资料。</p>
            <p className="text-sm text-ink/65">
              说明：此处会通过后台录入微信公众号推文链接与简介，前台列表展示，点击跳转公众号阅读。
              <br />
              Note: Managed via admin with WeChat links + summary; front-end lists items and opens the WeChat article on click.
            </p>
          </div>
        </Panel>
      </PageEnter>
    </PageShell>
  );
}

