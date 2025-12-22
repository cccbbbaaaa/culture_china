"use client";

import { useFormState } from "react-dom";

import { createResourceAction, type ResourceActionState } from "@/server/actions/admin-resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ResourceCreateFormProps {
  typeOptions: string[];
}

const initialState: ResourceActionState = {};

export const ResourceCreateForm = ({ typeOptions }: ResourceCreateFormProps) => {
  const [state, formAction] = useFormState(createResourceAction, initialState);

  return (
    <section className="rounded-3xl border border-stone/40 bg-canvas p-6 shadow-lg shadow-primary/5">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-serif font-semibold text-ink">新增外链资源 / Create resource</h2>
        <p className="text-sm text-ink/70">用于快速同步公众号推文，支持置顶与推荐标记。</p>
      </div>
      <form action={formAction} className="mt-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor="title">
              标题 / Title
            </label>
            <Input id="title" name="title" placeholder="请输入推文标题" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor="type">
              类型 / Category
            </label>
            <select
              className="h-10 w-full rounded-md border border-stone bg-canvas px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              id="type"
              name="type"
              required
              defaultValue=""
            >
              <option value="" disabled>
                请选择类型
              </option>
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor="url">
            链接 / URL
          </label>
          <Input id="url" name="url" placeholder="https://mp.weixin.qq.com/..." required type="url" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor="published_at">
              发布日期 / Published date
            </label>
            <Input id="published_at" name="published_at" type="date" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor="year">
              年份 / Year
            </label>
            <Input id="year" name="year" placeholder="自动推断或手动输入" type="number" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor="summary">
            摘要 / Summary
          </label>
          <Textarea id="summary" name="summary" placeholder="可选，简要说明内容" rows={4} />
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-ink/80">
            <input className="h-4 w-4 rounded border-stone text-primary" id="is_featured" name="is_featured" type="checkbox" />
            首页推荐 / Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-ink/80">
            <input className="h-4 w-4 rounded border-stone text-primary" id="is_pinned" name="is_pinned" type="checkbox" />
            置顶 / Pinned
          </label>
        </div>
        {state?.error ? <p className="text-sm text-primary">⚠️ {state.error}</p> : null}
        {state?.success ? <p className="text-sm text-emerald-600">✅ 已创建资源</p> : null}
        <Button size="lg" type="submit">
          保存资源 / Save resource
        </Button>
      </form>
    </section>
  );
};

