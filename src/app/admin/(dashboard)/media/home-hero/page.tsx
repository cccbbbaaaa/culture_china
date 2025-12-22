import { asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { MediaCreateForm } from "@/components/admin/media/media-create-form";
import { MediaList } from "@/components/admin/media/media-list";
import { MediaTabs } from "@/components/admin/media/media-tabs";
import { hasScope } from "@/lib/admin-auth";
import { getAdminSession } from "@/lib/admin-session";
import { db } from "@/lib/db";
import { activityMedia } from "@/db/schema";

export default async function AdminMediaHomeHeroPage() {
  const session = getAdminSession();

  if (!session || !hasScope(session.role, "media")) {
    redirect("/admin");
  }

  const heroMedia = await db
    .select()
    .from(activityMedia)
    .where(eq(activityMedia.slotKey, "home_hero"))
    .orderBy(asc(activityMedia.sortOrder), asc(activityMedia.id));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-ink">活动媒体管理 · Activity media</h1>
          <p className="text-sm text-ink/70">分区域管理首页轮播与 /activities 图库。</p>
        </div>
        <MediaTabs current="home_hero" />
      </div>
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-serif font-semibold text-ink">首页轮播 / Home hero</h2>
          <p className="text-sm text-ink/70">配置首页首屏轮播图，建议保持 2000x1200 图像。</p>
        </div>
        <MediaCreateForm slotKey="home_hero" slotLabel="首页轮播" />
        <MediaList items={heroMedia} title="首页轮播" />
      </section>
    </div>
  );
}

