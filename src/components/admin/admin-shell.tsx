import type { ReactNode } from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";
import type { AdminScope, AdminSessionPayload } from "@/lib/admin-auth";
import { hasScope } from "@/lib/admin-auth";

interface AdminShellProps {
  session: AdminSessionPayload;
  children: ReactNode;
}

const NAV_ITEMS: Array<{ label: string; description: string; href: string; scope: AdminScope }> = [
  {
    label: "外链资源管理",
    description: "公众号推文 / External resources",
    href: "/admin/resources",
    scope: "resources",
  },
  {
    label: "活动媒体管理",
    description: "首页轮播 · /activities 图库",
    href: "/admin/media",
    scope: "media",
  },
  {
    label: "学员风采管理",
    description: "学员信息 / Alumni profiles",
    href: "/admin/alumni",
    scope: "alumni",
  },
];

export const AdminShell = ({ session, children }: AdminShellProps) => {
  const items = NAV_ITEMS.filter((item) => hasScope(session.role, item.scope)).map(({ scope, ...rest }) => rest);

  return (
    <div className="min-h-screen bg-gradient-to-br from-canvas via-stone/30 to-canvas text-ink">
      <header className="border-b border-stone/40 bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-ink/60">Operations Console</p>
              <p className="text-xl font-serif font-semibold text-ink">文化中国 · 运维后台</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-ink/70">
              <span className="rounded-full border border-stone px-3 py-1">
                {session.username} · {session.role === "super_admin" ? "超级管理员 / Super Admin" : "内容管理员 / Content Editor"}
              </span>
              <LogoutButton />
            </div>
          </div>
          <AdminNav items={items} variant="pill" />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
};

