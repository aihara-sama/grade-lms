"use client";

import { useLesson } from "@/hooks/use-lesson";
import { isLessonEnded } from "@/utils/is-lesson-ended";
import { isLessonOngoing } from "@/utils/is-lesson-ongoing";
import { formatDistanceToNowStrict } from "date-fns";
import { useEffect, useRef, useState, type FunctionComponent } from "react";

interface Props {
  showTimeLeft?: boolean;
}

const LessonStatus: FunctionComponent<Props> = ({ showTimeLeft }) => {
  const [liveDate, setLiveDate] = useState<string>();
  const intervalIdRef = useRef<NodeJS.Timeout>();

  const { lesson, isEnded, isOngoing, setisEnded, setisOngoing } = useLesson();

  const getStatusColor = () => {
    if (isOngoing) return "bg-green-500";
    if (isEnded) return "bg-red-600";
    return "bg-yellow-400";
  };

  useEffect(() => {
    setLiveDate(formatDistanceToNowStrict(lesson.ends));
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);

    intervalIdRef.current = setInterval(() => {
      setLiveDate(formatDistanceToNowStrict(lesson.ends));

      if (isLessonOngoing(lesson)) setisOngoing(isLessonOngoing(lesson));
      if (isLessonEnded(new Date(lesson.ends)))
        setisEnded(isLessonEnded(new Date(lesson.ends)));
    }, 1000);

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [lesson]);

  return (
    <div className="flex items-center gap-3">
      <div className="text-4 flex items-center gap-2 relative text-sm whitespace-nowrap">
        <div className={`size-2 rounded-[50%] ${getStatusColor()}`}></div>
        {isOngoing && showTimeLeft ? (
          <span className="font-bold">{liveDate} left</span>
        ) : (
          <span className="font-bold">Ongoing</span>
        )}
        {isEnded && <span className="font-bold">Ended</span>}
        {!isOngoing && !isEnded && (
          <div>
            Starts in: <span className="font-bold">{liveDate}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonStatus;