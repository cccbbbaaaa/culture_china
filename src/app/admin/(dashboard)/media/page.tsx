import { redirect } from "next/navigation";

import { hasScope } from "@/lib/admin-auth";
import { getAdminSession } from "@/lib/admin-session";

export default function AdminMediaPage() {
  const session = getAdminSession();
  if (!session || !hasScope(session.role, "media")) {
    redirect("/admin");
  }

  redirect("/admin/media/home-hero");
}

