"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
import type { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <>
      <div style={{ height: "500px" }}>
        <Excalidraw />
      </div>
    </>
  );
};

export default Page;
