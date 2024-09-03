"use client";

import clsx from "clsx";
import { addHours, millisecondsToHours } from "date-fns";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const Cmp = () => {
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    setHasRendered(true);
  }, []);
  return (
    <div
      className={`size-20 bg-red-600 transition-all ${clsx(hasRendered && "translate-y-5")} `}
    ></div>
  );
};

const Page: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const starts = new Date("2024-10-27T02:00:00");
  const ends = new Date(addHours(starts, 1));
  const duration = +ends - +starts;

  console.log({
    starts,
    ends,
    duration,
    duratoinHours: millisecondsToHours(duration),
  });
  return (
    <div>
      <button onClick={() => setIsOpen((_) => !_)}>Toggle</button>
      {isOpen && <Cmp />}
    </div>
  );
};

export default Page;
