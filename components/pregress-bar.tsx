"use client";

import { AppProgressBar } from "next-nprogress-bar";
import type { FunctionComponent } from "react";

const ProgressBar: FunctionComponent = () => {
	return (
		<AppProgressBar
			height="3px"
			color="#1C92FF"
			options={{ showSpinner: false }}
			shallowRouting
		/>
	);
};

export default ProgressBar;
