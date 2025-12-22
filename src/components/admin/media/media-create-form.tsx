"use client";

import { useCallback, useEffect } from "react";
import { useFormState } from "react-dom";
import { CheckCircle2 } from "lucide-react";

import { createActivityMediaAction, type MediaActionState } from "@/server/actions/admin-media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUploadProgress } from "@/components/admin/media/use-upload-progress";

interface MediaCreateFormProps {
  slotKey: "home_hero" | "activities_gallery";
  slotLabel: string;
}

const initialState: MediaActionState = {};

export const MediaCreateForm = ({ slotKey, slotLabel }: MediaCreateFormProps) => {
  const [state, formAction] = useFormState(createActivityMediaAction, initialState);
  const { status, progress, begin, complete } = useUploadProgress();

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
    <section className="rounded-3xl border border-stone/40 bg-canvas p-6 shadow-lg shadow-stone/30">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-serif font-semibold text-ink">新增 {slotLabel}</h3>
        <p className="text-sm text-ink/70">上传图片并配置标题、副标题与跳转链接。</p>
      </div>
      <form action={formAction} className="mt-5 space-y-4" encType="multipart/form-data" onSubmit={handleSubmit}>
        <input name="slot_key" type="hidden" value={slotKey} />
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`${slotKey}-title`}>
            标题 / Title
          </label>
          <Input id={`${slotKey}-title`} name="title" placeholder="请输入标题" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`${slotKey}-subtitle`}>
            副标题 / Subtitle
          </label>
          <Textarea id={`${slotKey}-subtitle`} name="subtitle" placeholder="可选描述" rows={3} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor={`${slotKey}-link`}>
              链接 / Link URL
            </label>
            <Input id={`${slotKey}-link`} name="link_url" placeholder="https://..." type="url" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor={`${slotKey}-sort`}>
              排序值 / Sort order
            </label>
            <Input defaultValue={0} id={`${slotKey}-sort`} name="sort_order" type="number" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`${slotKey}-image`}>
            图片文件 / Image（自动压缩至 ≤ 1MB）
          </label>
          <Input accept="image/*" id={`${slotKey}-image`} name="image" required type="file" />
          <p className="text-xs text-ink/60">支持 jpg/png/webp，超过 1MB 时将自动压缩后再上传。</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink/80">
          <input className="h-4 w-4 rounded border-stone text-primary" defaultChecked name="is_active" type="checkbox" />
          立即启用 / Active
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
            上传成功 · 已创建
          </p>
        ) : null}
        <Button type="submit">上传并保存 / Upload</Button>
      </form>
    </section>
  );
};

