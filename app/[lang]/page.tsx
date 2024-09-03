"use client";

import clsx from "clsx";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const Cmp = () => {
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    setHasRendered(true);
  }, []);
  return (
    <div
      className={`size-20 bg-red-600 transition-all ${clsx(hasRendered && "translate-y-5")}`}
    ></div>
  );
};

const Page: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen((_) => !_)}>Toggle</button>
      {isOpen && <Cmp />}
    </div>
  );
};

export default Page;
