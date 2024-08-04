"use client";

import type { Database } from "@/types/supabase.type";
import Link from "next/link";
import type { FunctionComponent } from "react";

interface IProps {
  lesson: Database["public"]["Tables"]["lessons"]["Row"];
}

const LessonCard: FunctionComponent<IProps> = ({ lesson }) => {
  return (
    <div className="p-[24px] flex flex-col items-center w-[280px] rounded-[5px] border border-gray-200">
      <p className="text-xl font-bold">{lesson.title}</p>
      <hr className="mt-[10px] mb-[14px] w-3/4" />
      <p className="mb-[8px]">Starts in:</p>
      <p className="font-bold mb-[14px]">1h 30m</p>
      <button className="group-buttons">
        <button className="outline-button w-full">View</button>
        <Link
          className="link-button w-full"
          href={`/dashboard/lessons/${lesson.id}`}
        >
          Enter class
        </Link>
      </button>
      <button className="primary-button">Check assignments</button>
    </div>
  );
};

export default LessonCard;
