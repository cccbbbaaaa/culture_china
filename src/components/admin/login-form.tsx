"use client";

import { useFormState } from "react-dom";

import { adminLoginAction, type AdminLoginState } from "@/server/actions/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: AdminLoginState = {};

export const AdminLoginForm = () => {
  const [state, formAction] = useFormState(adminLoginAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink/80" htmlFor="username">
          管理员账号 / Username
        </label>
        <Input autoComplete="username" id="username" name="username" placeholder="请输入账号" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink/80" htmlFor="password">
          管理员密码 / Password
        </label>
        <Input autoComplete="current-password" id="password" name="password" placeholder="请输入密码" required type="password" />
      </div>
      {state?.error ? <p className="text-sm text-primary">⚠️ {state.error}</p> : null}
      <Button className="w-full" size="lg" type="submit">
        登录后台 / Sign in
      </Button>
    </form>
  );
};

