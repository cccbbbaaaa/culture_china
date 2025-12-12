import { PageHeader, PageShell, Panel } from "@/components/shared/page-shell";
import { PageEnter } from "@/components/shared/page-enter";

export default function ActivitiesVisitsPage() {
  return (
    <PageShell>
      <PageEnter>
        <PageHeader title="特色活动 · 访学交流" subtitle="国内外访学与实地走访的精彩记录即将发布。" />
        <Panel>
          <div className="space-y-2 text-base leading-relaxed text-ink/80">
            <p>将展示访学足迹、现场照片与参与者故事，敬请期待。</p>
            <p className="text-sm text-ink/65">
              说明：后台可定期上传对应的微信公众号推文链接与简介，前台仅展示信息，点击即跳转公众号查看全文。
              <br />
              Note: Admin will upload WeChat links + summary; the page lists items and opens the WeChat article on click.
            </p>
          </div>
        </Panel>
      </PageEnter>
    </PageShell>
  );
}

