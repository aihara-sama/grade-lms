"use client";

import type { NextPage } from "next";
import timezones from "timezones-list";

const Page: NextPage = () => {
  console.log(timezones);

  return <button>Click</button>;
};

export default Page;
