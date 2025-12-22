"use client";

import { useFormState } from "react-dom";

import { createAlumniProfileAction, type AlumniActionState } from "@/server/actions/admin-alumni";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AlumniCreateFormProps {
  defaultCohort?: number;
}

const initialState: AlumniActionState = {};

export const AlumniCreateForm = ({ defaultCohort }: AlumniCreateFormProps) => {
  const [state, formAction] = useFormState(createAlumniProfileAction, initialState);

  return (
    <section className="rounded-3xl border border-primary/30 bg-canvas p-6 shadow-lg shadow-primary/10">
      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.5em] text-primary/70">Create</p>
        <h2 className="text-2xl font-serif font-semibold text-ink">手动录入学员 / Create alumni profile</h2>
        <p className="text-sm text-ink/70">支持上传 5:7 照片（≤1MB）、教育经历与工作经历。</p>
      </div>

      <form action={formAction} className="mt-5 space-y-4" encType="multipart/form-data">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor="name">
              姓名 / Name
            </label>
            <Input id="name" name="name" placeholder="张三" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor="cohort">
              期数 / Cohort
            </label>
            <Input
              defaultValue={defaultCohort?.toString() ?? ""}
              id="cohort"
              min={1}
              name="cohort"
              placeholder="例如 18"
              required
              type="number"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor="gender">
              性别 / Gender
            </label>
            <Input id="gender" name="gender" placeholder="可选，如 男 / 女 / 其他" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor="email">
              邮箱 / Email
            </label>
            <Input id="email" name="email" placeholder="example@zju.edu.cn" required type="email" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor="major">
              专业 / Major
            </label>
            <Input id="major" name="major" placeholder="中文系" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor="website_url">
              个人链接 / Website
            </label>
            <Input id="website_url" name="website_url" placeholder="https://..." type="url" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor="city">
              城市 / City
            </label>
            <Input id="city" name="city" placeholder="杭州" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor="industry">
              行业 / Industry
            </label>
            <Input id="industry" name="industry" placeholder="文化传媒" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor="occupation">
              职业 / Occupation
            </label>
            <Input id="occupation" name="occupation" placeholder="内容品牌经理" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor="bio_zh">
              自我介绍（中文）/ Bio (ZH)
            </label>
            <Textarea id="bio_zh" name="bio_zh" placeholder="建议 200 字以内" rows={4} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor="bio_en">
              自我介绍（英文）/ Bio (EN)
            </label>
            <Textarea id="bio_en" name="bio_en" placeholder="Optional English intro" rows={4} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor="educations">
              教育经历 / Education (每行一条)
            </label>
            <Textarea id="educations" name="educations" placeholder="2022-2024 · 哈佛大学 · 教育学硕士" rows={4} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/80" htmlFor="experiences">
              工作/实践经历 / Experience (每行一条)
            </label>
            <Textarea id="experiences" name="experiences" placeholder="2021-至今 · 腾讯研究院 · 研究员" rows={4} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor="photo">
            学员照片（5:7 比例，≤1MB）
          </label>
          <Input accept="image/*" id="photo" name="photo" type="file" />
          <p className="text-xs text-ink/60">系统会自动裁剪为 5:7，建议上传胸像或半身照。</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-ink/80">
          <label className="flex items-center gap-2">
            <input className="h-4 w-4 rounded border-stone text-primary" defaultChecked id="allow_bio" name="allow_bio" type="checkbox" />
            允许展示简介
          </label>
          <label className="flex items-center gap-2">
            <input className="h-4 w-4 rounded border-stone text-primary" defaultChecked id="allow_photo" name="allow_photo" type="checkbox" />
            允许展示照片
          </label>
          <label className="flex items-center gap-2">
            <input className="h-4 w-4 rounded border-stone text-primary" id="is_archived" name="is_archived" type="checkbox" />
            归档（前台隐藏）
          </label>
        </div>

        {state?.error ? <p className="text-sm text-primary">⚠️ {state.error}</p> : null}
        {state?.success ? <p className="text-sm text-emerald-600">✅ 已创建学员档案</p> : null}

        <Button size="lg" type="submit">
          保存学员档案 / Save profile
        </Button>
      </form>
    </section>
  );
};

