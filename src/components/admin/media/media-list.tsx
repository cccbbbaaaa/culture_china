import Image from "next/image";

import type { ActivityMedia } from "@/db/schema";

import { MediaEditForm, type MediaFormDefaults } from "@/components/admin/media/media-edit-form";

interface MediaListProps {
  title: string;
  items: ActivityMedia[];
}

const mapMedia = (media: ActivityMedia): MediaFormDefaults => ({
  id: media.id,
  title: media.title,
  subtitle: media.subtitle ?? "",
  linkUrl: media.linkUrl ?? "",
  sortOrder: media.sortOrder ?? 0,
  slotKey: media.slotKey as "home_hero" | "activities_gallery",
  isActive: media.isActive,
});

export const MediaList = ({ title, items }: MediaListProps) => {
  if (items.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-stone/60 bg-canvas/80 p-6 text-center text-sm text-ink/60">
        {title} 暂无内容。
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <article key={item.id} className="rounded-3xl border border-stone/30 bg-canvas p-6 shadow-sm shadow-stone/40">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="md:w-1/3">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-stone/40 bg-stone/10">
                <Image
                  alt={item.title}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  src={`/api/media/${item.mediaId}`}
                />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-ink/50">{item.slotKey}</p>
                <h3 className="text-xl font-serif font-semibold text-ink">{item.title}</h3>
                {item.subtitle ? <p className="mt-1 text-sm text-ink/70">{item.subtitle}</p> : null}
              </div>
              {item.linkUrl ? (
                <a
                  className="inline-flex items-center text-sm text-primary underline-offset-4 hover:underline"
                  href={item.linkUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  访问链接 / Open link
                </a>
              ) : null}
              <p className="text-sm text-ink/70">排序：{item.sortOrder ?? 0} · 状态：{item.isActive ? "Active" : "Disabled"}</p>
            </div>
          </div>
          <details className="group mt-5 rounded-2xl border border-stone/40 bg-stone/10 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-primary transition group-open:mb-4 group-open:text-primary-dark">
              编辑 / Edit
            </summary>
            <MediaEditForm media={mapMedia(item)} />
          </details>
        </article>
      ))}
    </div>
  );
};



