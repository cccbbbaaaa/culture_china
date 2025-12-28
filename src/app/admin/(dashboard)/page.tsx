import { redirect } from "next/navigation";

import { getRoleLandingPath } from "@/lib/admin-auth";
import { getAdminSession } from "@/lib/admin-session";

export default function AdminHomePage() {
  const session = getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  redirect(getRoleLandingPath(session.role));
}



