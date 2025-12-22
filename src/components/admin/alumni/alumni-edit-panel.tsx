"use client";

import type { AdminAlumniProfileFormData } from "@/components/admin/alumni/alumni-edit-form";
import { AlumniEditForm } from "@/components/admin/alumni/alumni-edit-form";
import { AdminPanel } from "@/components/admin/admin-panel";
import { Button } from "@/components/ui/button";

interface AlumniEditPanelProps {
  profile: AdminAlumniProfileFormData;
  educations: string;
  experiences: string;
}

export const AlumniEditPanel = ({ profile, educations, experiences }: AlumniEditPanelProps) => {
  return (
    <AdminPanel
      title={`编辑：${profile.name}`}
      description="更新学员信息、教育与经历"
      widthClass="max-w-3xl"
      trigger={
        <Button size="sm" type="button" variant="outline" className="font-medium">
          编辑
        </Button>
      }
    >
      <AlumniEditForm educations={educations} experiences={experiences} profile={profile} />
    </AdminPanel>
  );
};

