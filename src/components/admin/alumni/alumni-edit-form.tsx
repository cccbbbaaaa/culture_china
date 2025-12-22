"use client";

import { useFormState } from "react-dom";

import { updateAlumniProfileAction, type AlumniActionState } from "@/server/actions/admin-alumni";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface AdminAlumniProfileFormData {
  id: number;
  name: string;
  cohort: number | null;
  email: string;
  gender: string | null;
  major: string | null;
  city: string | null;
  industry: string | null;
  occupation: string | null;
  websiteUrl: string | null;
  bioZh: string | null;
  bioEn: string | null;
  allowBio: boolean;
  allowPhoto: boolean;
  isArchived: boolean;
}

interface AlumniEditFormProps {
  profile: AdminAlumniProfileFormData;
  educations: string;
  experiences: string;
}

const initialState: AlumniActionState = {};

export const AlumniEditForm = ({ profile, educations, experiences }: AlumniEditFormProps) => {
  const [state, formAction] = useFormState(updateAlumniProfileAction.bind(null, profile.id), initialState);

  return (
    <form action={formAction} className="space-y-4" encType="multipart/form-data">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`name-${profile.id}`}>
            姓名 / Name
          </label>
          <Input defaultValue={profile.name} id={`name-${profile.id}`} name="name" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`cohort-${profile.id}`}>
            期数 / Cohort
          </label>
          <Input defaultValue={profile.cohort?.toString() ?? ""} id={`cohort-${profile.id}`} min={1} name="cohort" required type="number" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`gender-${profile.id}`}>
            性别 / Gender
          </label>
          <Input defaultValue={profile.gender ?? ""} id={`gender-${profile.id}`} name="gender" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`email-${profile.id}`}>
            邮箱 / Email
          </label>
          <Input defaultValue={profile.email} id={`email-${profile.id}`} name="email" required type="email" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`major-${profile.id}`}>
            专业 / Major
          </label>
          <Input defaultValue={profile.major ?? ""} id={`major-${profile.id}`} name="major" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`website-${profile.id}`}>
            个人链接 / Website
          </label>
          <Input defaultValue={profile.websiteUrl ?? ""} id={`website-${profile.id}`} name="website_url" type="url" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`city-${profile.id}`}>
            城市 / City
          </label>
          <Input defaultValue={profile.city ?? ""} id={`city-${profile.id}`} name="city" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`industry-${profile.id}`}>
            行业 / Industry
          </label>
          <Input defaultValue={profile.industry ?? ""} id={`industry-${profile.id}`} name="industry" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`occupation-${profile.id}`}>
            职业 / Occupation
          </label>
          <Input defaultValue={profile.occupation ?? ""} id={`occupation-${profile.id}`} name="occupation" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`bio_zh-${profile.id}`}>
            自我介绍（中文）/ Bio (ZH)
          </label>
          <Textarea defaultValue={profile.bioZh ?? ""} id={`bio_zh-${profile.id}`} name="bio_zh" rows={4} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`bio_en-${profile.id}`}>
            自我介绍（英文）/ Bio (EN)
          </label>
          <Textarea defaultValue={profile.bioEn ?? ""} id={`bio_en-${profile.id}`} name="bio_en" rows={4} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`educations-${profile.id}`}>
            教育经历 / Education
          </label>
          <Textarea defaultValue={educations} id={`educations-${profile.id}`} name="educations" rows={4} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor={`experiences-${profile.id}`}>
            工作/实践经历 / Experience
          </label>
          <Textarea defaultValue={experiences} id={`experiences-${profile.id}`} name="experiences" rows={4} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink/80" htmlFor={`photo-${profile.id}`}>
          替换照片（5:7，≤1MB，可选）
        </label>
        <Input accept="image/*" id={`photo-${profile.id}`} name="photo" type="file" />
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-ink/80">
        <label className="flex items-center gap-2">
          <input className="h-4 w-4 rounded border-stone text-primary" defaultChecked={profile.allowBio} name="allow_bio" type="checkbox" />
          展示简介
        </label>
        <label className="flex items-center gap-2">
          <input className="h-4 w-4 rounded border-stone text-primary" defaultChecked={profile.allowPhoto} name="allow_photo" type="checkbox" />
          展示照片
        </label>
        <label className="flex items-center gap-2">
          <input className="h-4 w-4 rounded border-stone text-primary" defaultChecked={profile.isArchived} name="is_archived" type="checkbox" />
          归档（前台隐藏）
        </label>
      </div>

      {state?.error ? <p className="text-sm text-primary">⚠️ {state.error}</p> : null}
      {state?.success ? <p className="text-sm text-emerald-600">✅ 已更新</p> : null}

      <Button type="submit">保存变更 / Save</Button>
    </form>
  );
};

