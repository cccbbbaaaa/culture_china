import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminSession } from "@/lib/admin-session";

// 确保后台布局动态渲染，避免登录状态缓存导致 404 / Force dynamic to avoid cached 404
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const session = getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell session={session}>{children}</AdminShell>;
}




