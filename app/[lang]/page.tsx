"use client";

import { format } from "date-fns";
import type { NextPage } from "next";

const Page: NextPage = () => {
  console.log(format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"));

  return <button>Click</button>;
};

export default Page;
