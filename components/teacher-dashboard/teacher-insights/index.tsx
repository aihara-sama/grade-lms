"use client";

import Insight from "@/components/course/insight";
import ChartSkeleton from "@/components/skeletons/chart-skeleton";
import type { getCourses } from "@/db/client/course";
import { getCoursesInsights } from "@/db/client/course";
import { getUsersInsights } from "@/db/client/user";
import type { ResultOf } from "@/types/utils.type";
import { getWeekNames } from "@/utils/date/get-week-names";
import { parseInsights } from "@/utils/parse/parse-insights";
import { useEffect, useState } from "react";

import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  courses: ResultOf<typeof getCourses>["data"];
}

const TeacherInsights: FunctionComponent<Props> = ({ courses }) => {
  // State
  const [usersInsights, setUsersInsights] = useState([]);
  const [coursesInsights, setCoursesInsights] = useState([]);

  // Effects
  useEffect(() => {
    (async () => {
      try {
        const [{ data: newUsersInsights }, { data: newCoursesInsights }] =
          await Promise.all([getUsersInsights(), getCoursesInsights()]);

        if (newUsersInsights.length) {
          setUsersInsights(Object.values(parseInsights(newUsersInsights)));
        }
        if (newCoursesInsights.length) {
          setCoursesInsights(Object.values(parseInsights(newCoursesInsights)));
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, [courses]);

  return (
    <div>
      <p className="section-title">Insights</p>
      <div className="flex gap-5 flex-col md:flex-row">
        {coursesInsights.length ? (
          <Insight
            label="Users"
            shouldCalcRightSide={false}
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
            label="Courses"
            shouldCalcRightSide={false}
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
