"use client";

import Insight from "@/components/course/insight";
import { getWeekDays } from "@/utils/get-week-days";
import { supabaseClient } from "@/utils/supabase/client";
import { addDays, format, subWeeks } from "date-fns";
import { useEffect, useState } from "react";

import ChartSkeleton from "@/components/skeletons/chart-skeleton";
import type { Lesson } from "@/types/lessons.type";
import type { FunctionComponent, PropsWithChildren } from "react";

interface IProps {
  courseId: string;
}

const getWeekNames = () => {
  return getWeekDays(addDays(subWeeks(new Date(), 1), 1)).map((day) =>
    format(new Date(day), "EE")
  );
};

const parseLessonsInsight = (lessons: Pick<Lesson, "ends">[]) => {
  const weekNamesRec: Record<string, number> = {};

  getWeekNames().forEach((name) => {
    weekNamesRec[name] = 0;
  });

  const dayCounts = lessons.reduce((acc, lesson) => {
    const day = new Date(lesson.ends).toLocaleDateString("en-US", {
      weekday: "short",
    });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, weekNamesRec);
  return dayCounts;
};

const CourseInsights: FunctionComponent<PropsWithChildren<IProps>> = ({
  courseId,
}) => {
  const [lessonsInsights, setLessonsInsights] = useState<number[]>([]);
  console.log({ lessonsInsights });

  useEffect(() => {
    (async () => {
      const { data } = await supabaseClient
        .from("courses")
        .select("lessons(ends)")
        .eq("id", courseId)
        .gte(
          "lessons.ends",
          format(addDays(subWeeks(new Date(), 1), 1), "yyyy-MM-dd'T'HH:mm:ss")
        )
        .lte("lessons.ends", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"));
      console.log({ data });

      if (data[0]?.lessons.length) {
        setLessonsInsights(Object.values(parseLessonsInsight(data[0].lessons)));
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
        <Insight
          label="New users"
          data={[0, 2, 1, 0, 0, 2, 5]}
          labels={["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]}
        />
      </div>
    </div>
  );
};

export default CourseInsights;
