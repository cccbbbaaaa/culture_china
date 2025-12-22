import Image from "next/image";

import type { AlumniEducation, AlumniExperience } from "@/db/schema";

import { AlumniEditPanel } from "@/components/admin/alumni/alumni-edit-panel";
import type { AdminAlumniProfileFormData } from "@/components/admin/alumni/alumni-edit-form";

interface AdminAlumniListProfile extends AdminAlumniProfileFormData {
  bioZh: string | null;
  updatedAt: Date | null;
  submissionTs: Date | null;
  photoAssetId: number | null;
}

interface AlumniListProps {
  profiles: AdminAlumniListProfile[];
  educations: Record<number, AlumniEducation[]>;
  experiences: Record<number, AlumniExperience[]>;
}

const formatDateTime = (value: Date | null) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" }).format(value);
};

const getExcerpt = (value: string | null | undefined, length = 90) => {
  if (!value) return "暂无自我介绍。";
  return value.length > length ? `${value.slice(0, length)}...` : value;
};

const groupByCohort = (profiles: AdminAlumniListProfile[]) => {
  const groups = new Map<number | "未分组", AdminAlumniListProfile[]>();
  profiles.forEach((profile) => {
    const key = profile.cohort ?? ("未分组" as const);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(profile);
  });
  return Array.from(groups.entries()).sort((a, b) => {
    const toNumber = (value: number | "未分组") => (value === "未分组" ? -Infinity : value);
    return toNumber(b[0]) - toNumber(a[0]);
  });
};

export const AlumniList = ({ profiles, educations, experiences }: AlumniListProps) => {
  if (profiles.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-stone/70 bg-canvas/80 p-6 text-center text-sm text-ink/60">
        暂无符合条件的学员记录。
      </section>
    );
  }

  const grouped = groupByCohort(profiles);

  return (
    <div className="space-y-8">
      {grouped.map(([cohort, members]) => (
        <section key={cohort} className="rounded-3xl border border-stone/40 bg-canvas shadow-sm">
          <div className="border-b border-stone/30 px-5 py-3">
            <p className="text-lg font-serif font-semibold text-ink">{cohort === "未分组" ? "未填写期数" : `第 ${cohort} 期`}</p>
            <p className="text-xs text-ink/60">仅展示姓名 / 自我介绍 / 照片，其余信息可在编辑面板中修改。</p>
          </div>
          <div className="divide-y divide-stone/20">
            {members.map((profile) => {
              const educationRows = educations[profile.id] ?? [];
              const experienceRows = experiences[profile.id] ?? [];
              const educationText = educationRows.map((item) => item.description).join("\n");
              const experienceText = experienceRows.map((item) => item.description).join("\n");

              return (
                <article key={profile.id} className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center">
                  <div className="flex items-start gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-stone/40 bg-stone/10">
                      {profile.photoAssetId ? (
                        <Image
                          alt={`${profile.name} portrait`}
                          className="object-cover"
                          fill
                          sizes="80px"
                          src={`/api/media/${profile.photoAssetId}`}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-ink/50">无照片</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="text-base font-serif font-semibold text-ink">{profile.name}</p>
                        <span className="rounded-full border border-stone/50 px-2 py-0.5 text-[11px] text-ink/70">
                          第 {profile.cohort ?? "?"} 期
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-ink/80">{getExcerpt(profile.bioZh)}</p>
                      <p className="mt-2 text-[11px] text-ink/60">
                        上传：{formatDateTime(profile.submissionTs ?? null)} · 更新：{formatDateTime(profile.updatedAt ?? null)}
                      </p>
                    </div>
                  </div>
                  <div className="md:ml-auto">
                    <AlumniEditPanel
                      educations={educationText}
                      experiences={experienceText}
                      profile={{
                        id: profile.id,
                        name: profile.name,
                        cohort: profile.cohort,
                        email: profile.email,
                        gender: profile.gender,
                        major: profile.major,
                        city: profile.city,
                        industry: profile.industry,
                        occupation: profile.occupation,
                        websiteUrl: profile.websiteUrl,
                        bioZh: profile.bioZh,
                        bioEn: profile.bioEn,
                        allowBio: profile.allowBio,
                        allowPhoto: profile.allowPhoto,
                        isArchived: profile.isArchived,
                      }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

