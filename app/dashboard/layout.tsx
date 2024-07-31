import Header from "@/components/header";
import { createClient } from "@/utils/supabase/server";
import type { FunctionComponent, PropsWithChildren } from "react";

const Layout: FunctionComponent<PropsWithChildren> = async ({ children }) => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <>
      <Header user={user} />
      {children}
    </>
  );
};

export default Layout;
