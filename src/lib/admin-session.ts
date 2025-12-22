import { cookies } from "next/headers";

import {
  ADMIN_SESSION_COOKIE_NAME,
  AdminSessionPayload,
  AdminUser,
  createSessionToken,
  parseSessionToken,
} from "@/lib/admin-auth";

const isProd = process.env.NODE_ENV === "production";

export const getAdminSession = (): AdminSessionPayload | null => {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  return parseSessionToken(token);
};

export const setAdminSession = (user: AdminUser) => {
  const { token, payload } = createSessionToken(user);
  cookies().set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    expires: new Date(payload.expiresAt),
  });
  return payload;
};

export const clearAdminSession = () => {
  cookies().delete(ADMIN_SESSION_COOKIE_NAME);
};

