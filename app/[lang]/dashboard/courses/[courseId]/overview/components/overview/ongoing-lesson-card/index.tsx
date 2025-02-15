"use client";

import type { getOngoingLesson } from "@/db/server/lesson";
import type { ResultOf } from "@/types/utils.type";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { type FunctionComponent } from "react";

interface Props {
  lesson: ResultOf<typeof getOngoingLesson>;
}

const OngoingLessonCard: FunctionComponent<Props> = ({ lesson }) => {
  // Hooks
  const t = useTranslations();

  // View
  return (
    <div className="relative flex-1 p-6 flex flex-col items-center justify-center">
      <img
        src="/assets/svg/current-lesson-frame.svg"
        alt=""
        className="absolute top-0 left-0 w-full h-full z-[-1]"
      />
      <p className="text-sm mb-[8px] text-light">
        {t("cards.titles.ongoing_lesson")}
      </p>
      <hr className="w-48 mb-2" />
      <p className="mb-1 text-lg font-bold">{lesson.title}</p>
      <Link className="mt-3" href={`/dashboard/lessons/${lesson.id}`}>
        <button className="warning-button w-64">
          {t("buttons.enter_class")}
        </button>
      </Link>
    </div>
  );
};

export default OngoingLessonCard;
