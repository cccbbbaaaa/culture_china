"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getRoleLandingPath, verifyAdminCredentials } from "@/lib/admin-auth";
import { clearAdminSession, setAdminSession } from "@/lib/admin-session";

const loginSchema = z.object({
  username: z.string().min(1, "请输入账号 / Username is required"),
  password: z.string().min(1, "请输入密码 / Password is required"),
});

export interface AdminLoginState {
  error?: string;
}

const LOGIN_ERROR_MESSAGE = "账号或密码错误 / Invalid username or password";

export const adminLoginAction = async (_prev: AdminLoginState, formData: FormData): Promise<AdminLoginState> => {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? LOGIN_ERROR_MESSAGE };
  }

  const user = await verifyAdminCredentials(parsed.data.username, parsed.data.password);
  if (!user) {
    return { error: LOGIN_ERROR_MESSAGE };
  }

  setAdminSession(user);
  redirect(getRoleLandingPath(user.role));
};

export const adminLogoutAction = async () => {
  clearAdminSession();
  redirect("/admin/login");
};



