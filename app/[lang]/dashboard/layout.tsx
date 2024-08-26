import ContentWrapper from "@/components/content-wrapper";
import Header from "@/components/header";
import UserProvider from "@/components/user-provider";
import { createClient } from "@/utils/supabase/server";
import type { FunctionComponent, PropsWithChildren } from "react";

const Layout: FunctionComponent<PropsWithChildren> = async ({ children }) => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <div className="h-full flex-col">
      <UserProvider user={user}>
        <Header />
        <ContentWrapper>{children}</ContentWrapper>
      </UserProvider>
    </div>
  );
};

export default Layout;
