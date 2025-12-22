import { createHmac, timingSafeEqual } from "node:crypto";

import { env } from "@/lib/env";

export type AdminRole = "content_editor" | "super_admin";

export type AdminScope = "resources" | "media" | "alumni";

export interface AdminUser {
  username: string;
  password: string;
  role: AdminRole;
}

export interface AdminSessionPayload {
  username: string;
  role: AdminRole;
  expiresAt: number;
}

export const ADMIN_SESSION_COOKIE_NAME = "admin_session";

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours session window / 会话有效期 12 小时

const adminUsers: AdminUser[] = [
  env.ADMIN_MEDIA_USER && env.ADMIN_MEDIA_PASSWORD
    ? {
        username: env.ADMIN_MEDIA_USER,
        password: env.ADMIN_MEDIA_PASSWORD,
        role: "content_editor",
      }
    : null,
  env.ADMIN_ROOT_USER && env.ADMIN_ROOT_PASSWORD
    ? {
        username: env.ADMIN_ROOT_USER,
        password: env.ADMIN_ROOT_PASSWORD,
        role: "super_admin",
      }
    : null,
].filter(Boolean) as AdminUser[];

if (process.env.NODE_ENV === "development") {
  console.log(
    "[admin init] available admin users",
    adminUsers.map((user) => ({
      username: user.username,
      passwordPreview: `${user.password.slice(0, 2)}***`,
    })),
  );
}

const roleScopes: Record<AdminRole, AdminScope[]> = {
  content_editor: ["resources", "media"],
  super_admin: ["resources", "media", "alumni"],
};

const roleLandingPaths: Record<AdminRole, string> = {
  content_editor: "/admin/resources",
  super_admin: "/admin/alumni",
};

const signPayload = (body: string) => {
  if (!env.ADMIN_SESSION_SECRET) {
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }
  return createHmac("sha256", env.ADMIN_SESSION_SECRET).update(body).digest("base64url");
};

const safeCompare = (a: string, b: string) => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return timingSafeEqual(bufA, bufB);
};

export const getRoleLandingPath = (role: AdminRole) => roleLandingPaths[role];

export const getRoleScopes = (role: AdminRole) => roleScopes[role];

export const hasScope = (role: AdminRole, scope: AdminScope | AdminScope[]) => {
  const scopes = Array.isArray(scope) ? scope : [scope];
  const allowed = new Set(roleScopes[role]);
  return scopes.every((item) => allowed.has(item));
};

export const verifyAdminCredentials = async (username: string, password: string): Promise<AdminUser | null> => {
  const user = adminUsers.find((item) => item.username === username);
  if (!user) {
    console.warn(`[admin login] unknown user: ${username}`);
    return null;
  }

  if (password !== user.password) {
    console.warn(`[admin login] invalid password for ${username}`);
    return null;
  }

  return user;
};

export const createSessionToken = (user: AdminUser) => {
  const payload: AdminSessionPayload = {
    username: user.username,
    role: user.role,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };

  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(body);

  return {
    token: `${body}.${signature}`,
    payload,
  };
};

export const parseSessionToken = (token: string | undefined | null): AdminSessionPayload | null => {
  if (!token) {
    return null;
  }

  const [body, signature] = token.split(".");
  if (!body || !signature) {
    return null;
  }

  const expectedSignature = signPayload(body);
  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as AdminSessionPayload;
    if (payload.expiresAt < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
};

