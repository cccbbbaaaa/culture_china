import Link from "next/link";

import type { ExternalResource } from "@/db/schema";
import { getResourceTypeLabel } from "@/lib/resource-types";

import { ResourceEditPanel } from "@/components/admin/resources/resource-edit-panel";
import type { ResourceFormDefaults } from "@/components/admin/resources/resource-edit-form";

interface ResourceListProps {
  resources: ExternalResource[];
  typeOptions: string[];
}

const displayDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const toDateInput = (value: Date | null) => {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
};

const formatDateTime = (value: Date | null) => {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  return displayDateFormatter.format(date).replace(/\./g, "/");
};

const mapResource = (resource: ExternalResource): ResourceFormDefaults => ({
  id: resource.id,
  title: resource.title,
  type: resource.type,
  url: resource.url,
  summary: resource.summary ?? "",
  publishedAt: toDateInput(resource.publishedAt ?? null),
  year: resource.year ? resource.year.toString() : "",
  isFeatured: resource.isFeatured,
  isPinned: resource.isPinned,
});

export const ResourceList = ({ resources, typeOptions }: ResourceListProps) => {
  if (resources.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-stone/60 bg-canvas/80 p-6 text-center text-sm text-ink/60">
        尚无数据，请先上传或新增外链资源。
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-stone/40 bg-canvas p-0 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[960px] w-full table-auto text-sm">
          <thead className="bg-stone/10 text-left text-xs uppercase tracking-wide text-ink/70">
            <tr>
              <th className="px-5 py-3 font-semibold">标题 & 摘要</th>
              <th className="px-4 py-3 font-semibold">类型</th>
              <th className="px-4 py-3 font-semibold">发布时间</th>
              <th className="px-4 py-3 font-semibold">更新时间</th>
              <th className="px-4 py-3 font-semibold">状态</th>
              <th className="px-4 py-3 font-semibold">操作</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => {
              const tag = getResourceTypeLabel(resource.type) ?? resource.type;
              const summary = resource.summary || "暂无摘要，建议补充以便前台展示。";
              const formDefaults = mapResource(resource);

              return (
                <tr key={resource.id} className="border-t border-stone/30 align-top">
                  <td className="px-5 py-4">
                    <div className="font-serif text-base font-semibold text-ink">{resource.title}</div>
                    <p className="mt-1 text-xs text-ink/70">{summary}</p>
                    <Link className="mt-1 inline-flex text-xs text-primary underline-offset-2 hover:underline" href={resource.url} rel="noreferrer" target="_blank">
                      查看原文 / Open link
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex whitespace-nowrap rounded-full border border-stone px-3 py-1 text-xs text-ink/70">{tag}</span>
                  </td>
                  <td className="px-4 py-4 text-xs text-ink/70 whitespace-nowrap">{formatDateTime(resource.publishedAt ?? null)}</td>
                  <td className="px-4 py-4 text-xs text-ink/70 whitespace-nowrap">{formatDateTime(resource.updatedAt ?? null)}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2 text-xs">
                      <span className={`rounded-full px-2 py-1 ${resource.isFeatured ? "bg-emerald-100 text-emerald-900" : "bg-stone/30 text-ink/70"}`}>
                        Featured：{resource.isFeatured ? "ON" : "OFF"}
                      </span>
                      <span className={`rounded-full px-2 py-1 ${resource.isPinned ? "bg-primary/10 text-primary" : "bg-stone/30 text-ink/70"}`}>
                        Pinned：{resource.isPinned ? "ON" : "OFF"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <ResourceEditPanel resource={formDefaults} typeOptions={typeOptions} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

