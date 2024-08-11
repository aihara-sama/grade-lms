"use client";

import "@/styles/nprogress.css";

import { AppProgressBar } from "next-nprogress-bar";
import type { FunctionComponent } from "react";

const ProgressBar: FunctionComponent = () => {
  return <AppProgressBar options={{ showSpinner: false }} shallowRouting />;
};

export default ProgressBar;
