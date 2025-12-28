"use client";

import { AdminPanel } from "@/components/admin/admin-panel";
import { AlumniCreateForm } from "@/components/admin/alumni/alumni-create-form";
import { Button } from "@/components/ui/button";

interface AlumniCreatePanelProps {
  defaultCohort?: number;
}

export const AlumniCreatePanel = ({ defaultCohort }: AlumniCreatePanelProps) => {
  return (
    <AdminPanel
      title="手动录入学员档案"
      description="填写基础信息、教育经历与照片"
      widthClass="max-w-3xl"
      trigger={
        <Button className="w-full font-serif" size="lg" type="button">
          新增学员档案
        </Button>
      }
    >
      <AlumniCreateForm defaultCohort={defaultCohort} />
    </AdminPanel>
  );
};



