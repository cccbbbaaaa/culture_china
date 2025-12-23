"use client";

import { Button } from "@/components/ui/button";
import { AdminPanel } from "@/components/admin/admin-panel";
import { ResourceCreateForm } from "@/components/admin/resources/resource-create-form";

interface ResourceCreatePanelProps {
  typeOptions: string[];
}

export const ResourceCreatePanel = ({ typeOptions }: ResourceCreatePanelProps) => {
  return (
    <AdminPanel
      title="新增外链资源"
      description="填写公众号推文信息并保存至数据库"
      trigger={
        <Button className="w-full font-serif" size="lg" type="button">
          新增外链资源
        </Button>
      }
    >
      <ResourceCreateForm typeOptions={typeOptions} />
    </AdminPanel>
  );
};


