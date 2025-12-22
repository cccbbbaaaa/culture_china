import { adminLogoutAction } from "@/server/actions/admin-auth";
import { Button } from "@/components/ui/button";

export const LogoutButton = () => (
  <form action={adminLogoutAction}>
    <Button type="submit" variant="outline">
      退出登录 / Sign out
    </Button>
  </form>
);

