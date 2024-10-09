"use client";

import { useLesson } from "@/hooks/use-lesson";
import { isLessonEnded } from "@/utils/lesson/is-lesson-ended";
import { isLessonOngoing } from "@/utils/lesson/is-lesson-ongoing";
import { formatDistanceToNowStrict } from "date-fns";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type FunctionComponent } from "react";

interface Props {
  showTimeLeft?: boolean;
}

const LessonStatus: FunctionComponent<Props> = ({ showTimeLeft = false }) => {
  // Hooks
  const t = useTranslations();
  const { lesson, isEnded, isOngoing, setIsEnded, setIsOngoing } = useLesson(
    (state) => state
  );

  // State
  const [liveDate, setLiveDate] = useState<string>();

  // Refs
  const intervalIdRef = useRef<NodeJS.Timeout>();

  // Handlers
  const getStatusColor = () => {
    if (isOngoing) return "bg-green-500";
    if (isEnded) return "bg-red-600";

    return "bg-yellow-400";
  };

  // Effects
  useEffect(() => {
    setLiveDate(formatDistanceToNowStrict(lesson.ends));

    if (intervalIdRef.current) clearInterval(intervalIdRef.current);

    intervalIdRef.current = setInterval(() => {
      setLiveDate(formatDistanceToNowStrict(lesson.ends));

      if (isLessonOngoing(lesson)) setIsOngoing(isLessonOngoing(lesson));
      if (isLessonEnded(lesson)) setIsEnded(isLessonEnded(lesson));
    }, 1000);

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [lesson]);

  // View
  return (
    <div className="flex items-center gap-3">
      <div className="text-4 flex items-center gap-2 relative text-sm whitespace-nowrap">
        <div className={`size-2 rounded-[50%] ${getStatusColor()}`}></div>
        {isOngoing &&
          (showTimeLeft ? (
            <span className="font-bold">
              {liveDate} {t("common.left")}
            </span>
          ) : (
            <span className="font-bold">{t("statuses.ongoing")}</span>
          ))}
        {isEnded && <span className="font-bold">{t("statuses.ended")}</span>}
        {!isOngoing && !isEnded && (
          <div>
            {t("labels.starts_in")}:{" "}
            <span className="font-bold">{liveDate}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonStatus;
