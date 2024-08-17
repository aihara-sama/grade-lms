"use client";

import CalendarWidget from "@/components/calendar-widget";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import TimeIcon from "@/components/icons/time-icon";
import type { Lesson } from "@/types/lessons.type";
import { supabaseClient } from "@/utils/supabase/client";
import { toCapitalCase } from "@/utils/to-capital-case";
import type { User } from "@supabase/supabase-js";
import { addDays, format, formatDistanceToNow, startOfDay } from "date-fns";
import Link from "next/link";
import { useEffect, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface IProps {
  user: User;
}

const DashboardSchedule: FunctionComponent<IProps> = ({ user }) => {
  const [schedule, setSchedule] = useState<
    (Lesson & { course: { title: string } })[]
  >([]);
  const [scheduleDate, setScheduleDate] = useState(startOfDay(new Date()));

  const handleDayChange = (date: Date) => {
    setScheduleDate(startOfDay(date));
  };

  const fetchLessonsByStartDate = (date: Date) =>
    supabaseClient
      .from("users")
      .select("id, courses(id, lessons(*, course:courses(title)))")
      .eq("id", user.id)
      .gte("courses.lessons.starts", format(date, "yyyy-MM-dd'T'HH:mm:ss"))
      .lt(
        "courses.lessons.starts",
        format(`${startOfDay(addDays(date, 1))}`, "yyyy-MM-dd'T'HH:mm:ss")
      )
      .single();

  const getWidgetStyle = (date: Date) => {
    let classes = "rounded-xl py-[2px] px-[8px] font-bold border-2 text-sm";

    if (+date < +new Date()) {
      classes += " text-rose-600 border-rose-600";
    } else {
      classes += " text-green-600 border-green-600";
    }
    return classes;
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await fetchLessonsByStartDate(scheduleDate);

      if (error) {
        toast.error("Something went wrong");
      } else {
        setSchedule(data.courses.map(({ lessons }) => lessons).flat());
      }
    })();
  }, [scheduleDate]);

  return (
    <div>
      <CalendarWidget onChange={handleDayChange} />
      <div className="mt-4">
        <h2 className="font-bold text-lg">My schedule</h2>
        <div className="flex flex-col gap-4 max-h-[300px] overflow-auto pr-2">
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
                className="w-full text-base font-bold truncate-fade max-w-[225px]"
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
