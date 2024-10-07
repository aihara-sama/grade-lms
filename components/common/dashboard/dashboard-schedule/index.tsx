"use client";

import CalendarWidget from "@/components/calendar-widget";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import NoDataIcon from "@/components/icons/no-data-icon";
import TimeIcon from "@/components/icons/time-icon";
import { LESSONS_GET_LIMIT } from "@/constants";
import { getDayLessons } from "@/db/client/lesson";
import { useUpdateEffect } from "@/hooks/use-update-effect";
import type { ResultOf } from "@/types/utils.type";
import { isCloseToBottom } from "@/utils/DOM/is-document-close-to-bottom";
import { toCapitalCase } from "@/utils/string/to-capital-case";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import { format, formatDistanceToNow, startOfDay } from "date-fns";
import Link from "next/link";
import type { FunctionComponent, UIEventHandler } from "react";
import { useCallback, useState } from "react";

import toast from "react-hot-toast";

interface Props {
  dayLessons: ResultOf<typeof getDayLessons>;
}

const DashboardSchedule: FunctionComponent<Props> = ({
  dayLessons: initDayLessons,
}) => {
  const [day, setDay] = useState(startOfDay(new Date()));
  const [dayLessons, setDayLessons] = useState(initDayLessons.data);

  const getWidgetStyle = (date: Date) => {
    let classes = "rounded-xl py-[2px] px-[8px] font-bold border-2 text-sm";

    if (+date < +new Date()) {
      classes += " text-rose-600 border-rose-600";
    } else {
      classes += " text-green-600 border-green-600";
    }
    return classes;
  };

  const fetchMoreDayLessons = async () => {
    try {
      const { data } = await getDayLessons(
        day,
        dayLessons.length,
        dayLessons.length + LESSONS_GET_LIMIT - 1
      );

      setDayLessons((prev) => [...prev, ...data]);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onScrollEnd = useCallback(throttleFetch(fetchMoreDayLessons), [
    day,
    dayLessons.length,
  ]);

  const onScroll: UIEventHandler<HTMLDivElement> = (e) => {
    if (isCloseToBottom(e.target as HTMLElement, 100)) onScrollEnd();
  };

  useUpdateEffect(() => {
    (async () => {
      try {
        const { data } = await getDayLessons(
          day,
          dayLessons.length,
          dayLessons.length + LESSONS_GET_LIMIT - 1
        );

        setDayLessons(data);
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, [day]);

  return (
    <div>
      <CalendarWidget onChange={(date) => setDay(startOfDay(date))} />
      <div className="mt-4">
        <h2 className="font-bold text-lg">My schedule</h2>
        <div
          className="flex flex-col gap-4 max-h-[800px] [@media(min-width:768px)]:max-h-[492px] [@media(min-width:897px)]:max-h-[300px] overflow-auto pr-2"
          onScroll={onScroll}
        >
          {!dayLessons.length && (
            <div className="flex gap-2 flex-col items-center mt-8">
              <NoDataIcon size="xl" />
              <p className="text-neutral-500">Your schedule will show here</p>
            </div>
          )}
          {dayLessons.map((lesson) => (
            <div key={lesson.id}>
              <div className="flex justify-between items-center">
                <div
                  title={lesson.course.title}
                  className="w-full text-base text-neutral-500 truncate-fade max-w-[140px]"
                >
                  {lesson.course.title}
                </div>
                <div className={getWidgetStyle(new Date(lesson.ends))}>
                  {+new Date(lesson.ends) < +new Date()
                    ? "Ended"
                    : toCapitalCase(
                        formatDistanceToNow(new Date(lesson.ends), {
                          addSuffix: true,
                        })
                      )}
                </div>
              </div>
              <div
                title={lesson.title}
                className="w-full text-base font-bold truncate-fade"
              >
                {lesson.title}
              </div>
              <div className="mb-3 flex items-center gap-2 text-sm">
                <TimeIcon />
                {format(lesson.starts, "h:mm a")}
              </div>
              <div className="mb-4 flex gap-3">
                <Link
                  href={`/dashboard/courses/${lesson.course_id}/lessons/${lesson.id}/assignments`}
                  className="flex items-center gap-2 border border-gray-200 py-[6px] px-3 rounded-lg hover:bg-gray-100 active:bg-gray-200 hover:text-primary"
                >
                  <AssignmentsIcon size="xs" />
                  Assignments
                </Link>
                <Link
                  href={`/dashboard/courses/${lesson.course_id}/lessons/${lesson.id}/overview`}
                  className="flex p-3 border border-gray-200 rounded-lg hover:bg-gray-100 active:bg-gray-200 hover:text-primary"
                >
                  <LessonsIcon size="xs" />
                </Link>
              </div>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSchedule;
