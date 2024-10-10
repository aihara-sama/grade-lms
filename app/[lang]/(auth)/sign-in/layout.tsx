import type { Metadata, NextPage } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Login",
};

const Layout: NextPage<PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

export default Layout;
