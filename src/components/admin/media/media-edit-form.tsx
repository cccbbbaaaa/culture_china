"use client";

import { useCallback, useEffect } from "react";
import { useFormState } from "react-dom";
import { CheckCircle2 } from "lucide-react";

import {
  deleteActivityMediaAction,
  updateActivityMediaAction,
  type MediaActionState,
} from "@/server/actions/admin-media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUploadProgress } from "@/components/admin/media/use-upload-progress";

export interface MediaFormDefaults {
  id: number;
  title: string;
  subtitle: string;
  linkUrl: string;
  sortOrder: number;
  slotKey: "home_hero" | "activities_gallery";
  isActive: boolean;
}

interface MediaEditFormProps {
  media: MediaFormDefaults;
}

const initialState: MediaActionState = {};
const deleteInitialState: MediaActionState = {};

export const MediaEditForm = ({ media }: MediaEditFormProps) => {
  const [state, formAction] = useFormState(updateActivityMediaAction.bind(null, media.id), initialState);
  const [deleteState, deleteAction] = useFormState(deleteActivityMediaAction.bind(null, media.id), deleteInitialState);
  const { status, progress, begin, complete } = useUploadProgress();

  const handleDelete = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    if (!confirm(`确认删除条目「${media.title}」?`)) {
      event.preventDefault();
    }
  }, [media.title]);

  useEffect(() => {
    if (state?.success) {
      complete("success");
    } else if (state?.error) {
      complete("error");
    }
  }, [state?.success, state?.error, complete]);

  const handleSubmit = useCallback(() => {
    begin();
  }, [begin]);

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4" encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor={`media-title-${media.id}`}>
              标题 / Title
            </label>
            <Input defaultValue={media.title} id={`media-title-${media.id}`} name="title" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor={`media-slot-${media.id}`}>
              Slot Key
            </label>
            <select
              className="h-10 w-full rounded-md border border-stone bg-canvas px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              defaultValue={media.slotKey}
              id={`media-slot-${media.id}`}
              name="slot_key"
            >
              <option value="home_hero">home_hero · 首页轮播</option>
              <option value="activities_gallery">activities_gallery · 活动图库</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`media-subtitle-${media.id}`}>
            副标题 / Subtitle
          </label>
          <Textarea defaultValue={media.subtitle} id={`media-subtitle-${media.id}`} name="subtitle" rows={3} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor={`media-link-${media.id}`}>
              链接 / Link URL
            </label>
            <Input defaultValue={media.linkUrl} id={`media-link-${media.id}`} name="link_url" placeholder="https://..." type="url" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor={`media-sort-${media.id}`}>
              排序 / Sort order
            </label>
            <Input defaultValue={media.sortOrder} id={`media-sort-${media.id}`} name="sort_order" type="number" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`media-image-${media.id}`}>
            替换图片（可选）/ Replace image (auto-compress ≤ 1MB)
          </label>
          <Input accept="image/*" id={`media-image-${media.id}`} name="image" type="file" />
          <p className="text-xs text-ink/60">不上传则保留现有图片，超过 1MB 的文件会自动压缩。</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink/80">
          <input className="h-4 w-4 rounded border-stone text-primary" defaultChecked={media.isActive} name="is_active" type="checkbox" />
          启用 / Active
        </label>
        {status !== "idle" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-ink/70">
              <span>{status === "uploading" ? "上传与压缩中..." : status === "success" ? "上传完成" : "上传失败"}</span>
              <span>{status === "error" ? "--" : `${Math.round(progress)}%`}</span>
            </div>
            <div className="h-2 rounded-full bg-stone/20">
              <div
                className={`h-full rounded-full transition-all duration-200 ${
                  status === "error" ? "bg-primary" : "bg-primary/80"
                }`}
                style={{ width: `${status === "error" ? 100 : progress}%` }}
              />
            </div>
          </div>
        ) : null}
        {state?.error ? <p className="text-sm text-primary">⚠️ {state.error}</p> : null}
        {state?.success ? (
          <p className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            已保存 · 上传成功
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button type="submit">保存 / Save</Button>
        </div>
      </form>
      <form action={deleteAction} className="space-y-2 text-right" onSubmit={handleDelete}>
        {deleteState?.error ? <p className="text-sm text-primary">⚠️ {deleteState.error}</p> : null}
        {deleteState?.success ? <p className="text-sm text-emerald-600">✅ 已删除该条目</p> : null}
        <Button type="submit" variant="ghost">
          删除条目 / Delete
        </Button>
      </form>
    </div>
  );
};

