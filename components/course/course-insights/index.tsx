"use client";

import Insight from "@/components/course/insight";
import ChartSkeleton from "@/components/skeletons/chart-skeleton";
import { DB } from "@/lib/supabase/db";
import { getWeekNames } from "@/utils/date/get-week-names";
import { parseInsights } from "@/utils/parse/parse-insights";
import { addDays, format, subWeeks } from "date-fns";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

interface Props {
  courseId: string;
}

const CourseInsights: FunctionComponent<Props> = ({ courseId }) => {
  // State
  const [lessonsInsights, setLessonsInsights] = useState<number[]>([]);
  const [usersInsights, setUsersInsights] = useState<number[]>([]);

  // Hooks
  const t = useTranslations();

  // Handlers
  const getLessonsInsights = async () => {
    const result = await DB.from("courses")
      .select("lessons(timestamp:ends)")
      .eq("id", courseId)
      .gte(
        "lessons.ends",
        format(addDays(subWeeks(new Date(), 1), 1), "yyyy-MM-dd'T'HH:mm:ss")
      )
      .lte("lessons.ends", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"))
      .single();

    if (result.error) throw new Error(t("failed_lo_load_lessons_insights"));

    return result.data.lessons;
  };
  const getUsersInsights = async () => {
    const result = await DB.from("user_courses")
      .select("timestamp:created_at")
      .eq("course_id", courseId)
      .gte(
        "created_at",
        format(addDays(subWeeks(new Date(), 1), 1), "yyyy-MM-dd'T'HH:mm:ss")
      )
      .lte("created_at", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"));

    if (result.error) throw new Error(t("failed_lo_load_users_insights"));

    return result.data;
  };

  // Effects
  useEffect(() => {
    (async () => {
      try {
        const [usersInsightsData, lessonsInsightsData] = await Promise.all([
          getUsersInsights(),
          getLessonsInsights(),
        ]);

        setUsersInsights(parseInsights(usersInsightsData));
        setLessonsInsights(parseInsights(lessonsInsightsData));
      } catch (error: any) {
        toast.error(error.message);
      }
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
