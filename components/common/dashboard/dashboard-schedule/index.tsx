"use client";

import CalendarWidget from "@/components/calendar-widget";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import TimeIcon from "@/components/icons/time-icon";
import { LESSONS_GET_LIMIT } from "@/constants";
import { useUser } from "@/hooks/use-user";
import { DB } from "@/lib/supabase/db";
import type { Lesson } from "@/types/lesson.type";
import { isCloseToBottom } from "@/utils/DOM/is-document-close-to-bottom";
import { toCapitalCase } from "@/utils/string/to-capital-case";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import { addDays, format, formatDistanceToNow, startOfDay } from "date-fns";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { FunctionComponent, UIEventHandler } from "react";
import { useCallback, useEffect, useState } from "react";

import toast from "react-hot-toast";

const DashboardSchedule: FunctionComponent = () => {
  const [schedule, setSchedule] = useState<
    (Lesson & { course: { title: string } })[]
  >([]);
  const [scheduleDate, setScheduleDate] = useState(startOfDay(new Date()));

  const t = useTranslations();
  const user = useUser((state) => state.user);

  const getWidgetStyle = (date: Date) => {
    let classes = "rounded-xl py-[2px] px-[8px] font-bold border-2 text-sm";

    if (+date < +new Date()) {
      classes += " text-rose-600 border-rose-600";
    } else {
      classes += " text-green-600 border-green-600";
    }
    return classes;
  };

  const fetchLessonsByStartDate = (date: Date) =>
    DB.from("users")
      .select("id, courses(id, lessons(*, course:courses(title)))")
      .eq("id", user.id)
      .range(schedule.length, schedule.length + LESSONS_GET_LIMIT - 1, {
        foreignTable: "courses.lessons",
      })
      .gte("courses.lessons.starts", format(date, "yyyy-MM-dd'T'HH:mm:ss"))
      .lt(
        "courses.lessons.starts",
        format(`${startOfDay(addDays(date, 1))}`, "yyyy-MM-dd'T'HH:mm:ss")
      )
      .single();

  const fetchMoreLessons = async () => {
    try {
      const { data, error } = await fetchLessonsByStartDate(scheduleDate);

      if (error) throw new Error(t("failed_to_load_lessons"));

      if (data.courses.length) {
        setSchedule((prev) => [
          ...prev,
          ...data.courses.map(({ lessons }) => lessons).flat(),
        ]);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onScrollEnd = useCallback(throttleFetch(fetchMoreLessons), [
    scheduleDate,
    schedule.length,
  ]);

  const onScroll: UIEventHandler<HTMLDivElement> = (e) => {
    if (isCloseToBottom(e.target as HTMLElement, 100)) onScrollEnd();
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await fetchLessonsByStartDate(scheduleDate);

      if (error) {
        toast.error(t("failed_to_load_lessons"));
      } else {
        setSchedule(data.courses.map(({ lessons }) => lessons).flat());
      }
    })();
  }, [scheduleDate]);

  return (
    <div>
      <CalendarWidget onChange={(date) => setScheduleDate(startOfDay(date))} />
      <div className="mt-4">
        <h2 className="font-bold text-lg">My schedule</h2>
        <div
          className="flex flex-col gap-4 max-h-[800px] [@media(min-width:768px)]:max-h-[492px] [@media(min-width:897px)]:max-h-[300px] overflow-auto pr-2"
          onScroll={onScroll}
        >
          {schedule.map((lesson) => (
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
              <hr className="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSchedule;
