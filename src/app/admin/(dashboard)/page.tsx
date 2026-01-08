import { redirect } from "next/navigation";

import { getRoleLandingPath } from "@/lib/admin-auth";
import { getAdminSession } from "@/lib/admin-session";

// 保持动态，确保根据实时会话跳转 / Force dynamic to respect live session
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminHomePage() {
  const session = getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  redirect(getRoleLandingPath(session.role));
}




