import type { FunctionComponent, PropsWithChildren } from "react";

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return <div>{children}</div>;
};

export default Layout;
