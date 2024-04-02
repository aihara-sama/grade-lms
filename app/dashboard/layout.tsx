import Header from "@/components/header";
import type { FunctionComponent, PropsWithChildren } from "react";

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<Header />
			{children}
		</>
	);
};

export default Layout;
