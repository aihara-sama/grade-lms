"use client";

import Insight from "@/components/course/insight";
import ChartSkeleton from "@/components/skeletons/chart-skeleton";
import { getWeekNames } from "@/utils/get-week-names";
import { parseInsights } from "@/utils/parse-insights";
import { supabaseClient } from "@/utils/supabase/client";
import { addDays, format, subWeeks } from "date-fns";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import type { FunctionComponent } from "react";

interface IProps {
  courseId: string;
}

const CourseInsights: FunctionComponent<IProps> = ({ courseId }) => {
  // State
  const [lessonsInsights, setLessonsInsights] = useState<number[]>([]);
  const [usersInsights, setUsersInsights] = useState<number[]>([]);

  // Handlers
  const getLessonsInsights = () => {
    return supabaseClient
      .from("courses")
      .select("lessons(timestamp:ends)")
      .eq("id", courseId)
      .gte(
        "lessons.ends",
        format(addDays(subWeeks(new Date(), 1), 1), "yyyy-MM-dd'T'HH:mm:ss")
      )
      .lte("lessons.ends", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"));
  };
  const getUsersInsights = () => {
    return supabaseClient
      .from("user_courses")
      .select("timestamp:created_at")
      .eq("course_id", courseId)
      .gte(
        "created_at",
        format(addDays(subWeeks(new Date(), 1), 1), "yyyy-MM-dd'T'HH:mm:ss")
      )
      .lte("created_at", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"));
  };

  // Effects
  useEffect(() => {
    (async () => {
      const [users, lessons] = await Promise.all([
        getUsersInsights(),
        getLessonsInsights(),
      ]);

      if (users.data) {
        setUsersInsights(Object.values(parseInsights(users.data)));
      }

      if (lessons.data[0]?.lessons.length) {
        setLessonsInsights(
          Object.values(parseInsights(lessons.data[0].lessons))
        );
      }

      if (users.error || lessons.error) toast.error("Something went wrong");
    })();
  }, []);

  return (
    <div>
      <p className="section-title">Insights</p>
      <div className="flex gap-5 flex-col md:flex-row">
        {lessonsInsights.length ? (
          <Insight
            label="Lessons"
            data={lessonsInsights}
            labels={getWeekNames()}
          />
        ) : (
          <div className="flex-1">
            <ChartSkeleton record="Lessons" />
          </div>
        )}
        {usersInsights.length ? (
          <Insight
            label="New members"
            data={usersInsights}
            labels={getWeekNames()}
          />
        ) : (
          <div className="flex-1">
            <ChartSkeleton record="New members" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseInsights;
