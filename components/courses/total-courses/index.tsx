"use client";

import type { FunctionComponent } from "react";

import CoursesIcon from "@/components/icons/courses-icon";
import { useRouter } from "next/navigation";

interface Props {
  total: number;
  title?: string;
  href?: string;
}

const TotalCourses: FunctionComponent<Props> = ({
  total,
  href,
  title = "Total courses",
}) => {
  const router = useRouter();

  return (
    <div className="shadow-sm flex flex-col items-center p-[24px] w-[280px] rounded-[5px]">
      <CoursesIcon />
      <hr />
      <p>{title}</p>

      <p className="mt-[8px] text-4xl">{total}</p>
      {href && (
        <button
          className="primary-button w-full mt-2"
          onClick={() => router.push(href)}
        >
          View all
        </button>
      )}
    </div>
  );
};

export default TotalCourses;
