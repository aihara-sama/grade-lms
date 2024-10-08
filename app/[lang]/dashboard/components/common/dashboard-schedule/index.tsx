"use client";

import DashboardLesson from "@/app/[lang]/dashboard/components/common/dashboard-schedule/dashboard-lesson";
import CalendarWidget from "@/components/common/calendar-widget";
import NoDataIcon from "@/components/icons/no-data-icon";
import { LESSONS_GET_LIMIT } from "@/constants";
import { getDayLessons } from "@/db/client/lesson";
import { useUpdateEffect } from "@/hooks/use-update-effect";
import type { ResultOf } from "@/types/utils.type";
import { isCloseToBottom } from "@/utils/DOM/is-document-close-to-bottom";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import { startOfDay } from "date-fns";
import type { FunctionComponent, UIEventHandler } from "react";
import { useCallback, useState } from "react";

import toast from "react-hot-toast";

interface Props {
  dayLessons: ResultOf<typeof getDayLessons>;
}

const DashboardSchedule: FunctionComponent<Props> = ({
  dayLessons: initDayLessons,
}) => {
  // State
  const [day, setDay] = useState(startOfDay(new Date()));
  const [dayLessons, setDayLessons] = useState(initDayLessons.data);

  // Handlers
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

  // Effects
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

  // VIew
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
            <DashboardLesson lesson={lesson} key={lesson.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSchedule;
