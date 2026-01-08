import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/login-form";
import { getAdminSession } from "@/lib/admin-session";
import { getRoleLandingPath } from "@/lib/admin-auth";

// 强制动态渲染，避免登录后因缓存导致的 404 / Force dynamic rendering to avoid cached 404 after login
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLoginPage() {
  const session = getAdminSession();

  if (session) {
    redirect(getRoleLandingPath(session.role));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-canvas via-primary/5 to-canvas px-4">
      <div className="w-full max-w-md rounded-3xl border border-stone/60 bg-canvas/95 p-8 shadow-2xl backdrop-blur">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-ink/60">Cultural China · Admin</p>
          <h1 className="text-2xl font-serif font-semibold text-ink">运维后台登录</h1>
          <p className="text-sm text-ink/70">使用提供的管理员账号进入 · Use assigned account to sign in.</p>
        </div>
        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}




