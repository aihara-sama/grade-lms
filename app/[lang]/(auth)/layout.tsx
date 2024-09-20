import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { redirect } from "next/navigation";
import type { FunctionComponent, PropsWithChildren } from "react";

const Layout: FunctionComponent<PropsWithChildren> = async ({ children }) => {
  const {
    data: { user },
  } = await getServerDB().auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }
  return <>{children}</>;
};

export default Layout;
