import { createClient } from "@/helpers/supabase/server";
import { redirect } from "next/navigation";

import type { FunctionComponent, PropsWithChildren } from "react";

const Layout: FunctionComponent<PropsWithChildren> = async ({ children }) => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }
  return <>{children}</>;
};

export default Layout;
