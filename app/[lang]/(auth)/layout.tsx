import { getProfile } from "@/db/server/user";
import { redirect } from "next/navigation";
import type { FunctionComponent, PropsWithChildren } from "react";

const Layout: FunctionComponent<PropsWithChildren> = async ({ children }) => {
  const {
    data: { user },
  } = await getProfile();

  if (user) return redirect("/dashboard");

  return <>{children}</>;
};

export default Layout;
