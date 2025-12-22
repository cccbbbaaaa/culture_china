"use client";

import { useCallback } from "react";
import { useFormState } from "react-dom";

import {
  deleteResourceAction,
  updateResourceAction,
  type ResourceActionState,
} from "@/server/actions/admin-resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface ResourceFormDefaults {
  id: number;
  title: string;
  type: string;
  url: string;
  summary: string;
  publishedAt: string;
  year: string;
  isFeatured: boolean;
  isPinned: boolean;
}

interface ResourceEditFormProps {
  resource: ResourceFormDefaults;
  typeOptions: string[];
}

const initialState: ResourceActionState = {};
const deleteInitialState: ResourceActionState = {};

export const ResourceEditForm = ({ resource, typeOptions }: ResourceEditFormProps) => {
  const [state, formAction] = useFormState(updateResourceAction.bind(null, resource.id), initialState);
  const [deleteState, deleteAction] = useFormState(deleteResourceAction.bind(null, resource.id), deleteInitialState);

  const handleDelete = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    if (!confirm(`确认删除「${resource.title}」?`)) {
      event.preventDefault();
    }
  }, [resource.title]);

  return (
    <div className="space-y-5">
      <form action={formAction} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor={`title-${resource.id}`}>
              标题 / Title
            </label>
            <Input defaultValue={resource.title} id={`title-${resource.id}`} name="title" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor={`type-${resource.id}`}>
              类型 / Category
            </label>
            <select
              className="h-10 w-full rounded-md border border-stone bg-canvas px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              defaultValue={resource.type}
              id={`type-${resource.id}`}
              name="type"
              required
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`url-${resource.id}`}>
            链接 / URL
          </label>
          <Input defaultValue={resource.url} id={`url-${resource.id}`} name="url" required type="url" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor={`published-${resource.id}`}>
              发布日期 / Published date
            </label>
            <Input defaultValue={resource.publishedAt} id={`published-${resource.id}`} name="published_at" type="date" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor={`year-${resource.id}`}>
              年份 / Year
            </label>
            <Input defaultValue={resource.year} id={`year-${resource.id}`} name="year" type="number" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`summary-${resource.id}`}>
            摘要 / Summary
          </label>
          <Textarea defaultValue={resource.summary} id={`summary-${resource.id}`} name="summary" rows={4} />
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-ink/80">
            <input
              className="h-4 w-4 rounded border-stone text-primary"
              defaultChecked={resource.isFeatured}
              name="is_featured"
              type="checkbox"
            />
            Featured / 首页推荐
          </label>
          <label className="flex items-center gap-2 text-sm text-ink/80">
            <input className="h-4 w-4 rounded border-stone text-primary" defaultChecked={resource.isPinned} name="is_pinned" type="checkbox" />
            Pinned / 列表置顶
          </label>
        </div>
        {state?.error ? <p className="text-sm text-primary">⚠️ {state.error}</p> : null}
        {state?.success ? <p className="text-sm text-emerald-600">✅ 已保存 / Saved</p> : null}
        <div className="flex flex-wrap gap-3">
          <Button type="submit">保存更改 / Save</Button>
        </div>
      </form>
      <form action={deleteAction} className="space-y-2 text-right" onSubmit={handleDelete}>
        {deleteState?.error ? <p className="text-sm text-primary">⚠️ {deleteState.error}</p> : null}
        {deleteState?.success ? <p className="text-sm text-emerald-600">✅ 已删除该资源</p> : null}
        <Button type="submit" variant="ghost">
          删除资源 / Delete
        </Button>
      </form>
    </div>
  );
};

