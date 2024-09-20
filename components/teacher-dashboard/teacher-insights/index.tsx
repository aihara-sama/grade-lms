"use client";

import Insight from "@/components/course/insight";
import ChartSkeleton from "@/components/skeletons/chart-skeleton";
import { useUser } from "@/hooks/use-user";
import { browserDB } from "@/lib/supabase/db/browser-db";
import type { CourseWithRefsCount } from "@/types/course.type";
import { getWeekNames } from "@/utils/date/get-week-names";
import { parseInsights } from "@/utils/parse/parse-insights";
import { addDays, format, subWeeks } from "date-fns";
import { useEffect, useState } from "react";

import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  courses: CourseWithRefsCount[];
}

const TeacherInsights: FunctionComponent<Props> = ({ courses }) => {
  // State
  const [usersInsights, setUsersInsights] = useState<number[]>([]);
  const [coursesInsights, setCoursesInsights] = useState<number[]>([]);

  // Hooks
  const { user } = useUser();

  // Handlers
  const fetchCoursesInsights = () => {
    return browserDB
      .from("users")
      .select("courses(timestamp:created_at)")
      .eq("id", user.id)
      .gte(
        "created_at",
        format(addDays(subWeeks(new Date(), 1), 1), "yyyy-MM-dd'T'HH:mm:ss")
      )
      .lte("created_at", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"));
    // .single();
  };
  const fetchUsersInsights = () => {
    return browserDB
      .from("users")
      .select("timestamp:created_at")
      .eq("creator_id", user.id)
      .gte(
        "created_at",
        format(addDays(subWeeks(new Date(), 1), 1), "yyyy-MM-dd'T'HH:mm:ss")
      )
      .lte("created_at", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"));
  };

  // Effects
  useEffect(() => {
    (async () => {
      const [usersData, coursesData] = await Promise.all([
        fetchUsersInsights(),
        fetchCoursesInsights(),
      ]);

      if (usersData.data.length) {
        setUsersInsights(Object.values(parseInsights(usersData.data)));
      }
      if (coursesData.data[0]?.courses?.length) {
        setCoursesInsights(
          Object.values(parseInsights(coursesData.data[0].courses))
        );
      }

      if (coursesData.error || usersData.error)
        toast.error("Something went wrong");
    })();
  }, [courses]);

  return (
    <div>
      <p className="section-title">Insights</p>
      <div className="flex gap-5 flex-col md:flex-row">
        {usersInsights.length ? (
          <Insight
            shouldCalcRightSide={false}
            label="Users"
            data={usersInsights}
            labels={getWeekNames()}
          />
        ) : (
          <div className="flex-1">
            <ChartSkeleton record="Users" />
          </div>
        )}
        {coursesInsights.length ? (
          <Insight
            shouldCalcRightSide={false}
            label="Courses"
            data={coursesInsights}
            labels={getWeekNames()}
          />
        ) : (
          <div className="flex-1">
            <ChartSkeleton record="Courses" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherInsights;
