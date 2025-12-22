"use client";

import type { ResourceFormDefaults } from "@/components/admin/resources/resource-edit-form";
import { ResourceEditForm } from "@/components/admin/resources/resource-edit-form";
import { AdminPanel } from "@/components/admin/admin-panel";
import { Button } from "@/components/ui/button";

interface ResourceEditPanelProps {
  resource: ResourceFormDefaults;
  typeOptions: string[];
}

export const ResourceEditPanel = ({ resource, typeOptions }: ResourceEditPanelProps) => {
  return (
    <AdminPanel
      title={`编辑：${resource.title}`}
      description="更新内容、推荐位与链接"
      trigger={
        <Button size="sm" type="button" variant="outline" className="font-medium">
          编辑
        </Button>
      }
    >
      <ResourceEditForm resource={resource} typeOptions={typeOptions} />
    </AdminPanel>
  );
};

