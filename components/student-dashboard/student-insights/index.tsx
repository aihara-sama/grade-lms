"use client";

import Insight from "@/components/course/insight";
import ChartSkeleton from "@/components/skeletons/chart-skeleton";
import { DB } from "@/lib/supabase/db";
import { getWeekNames } from "@/utils/date/get-week-names";
import { parseInsights } from "@/utils/parse/parse-insights";
import type { User } from "@supabase/supabase-js";
import { addDays, format, subWeeks } from "date-fns";
import { useEffect, useState } from "react";

import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  user: User;
}

const StudentInsights: FunctionComponent<Props> = ({ user }) => {
  // State
  const [assignmentsInsights, setAssignmentsInsights] = useState<number[]>([]);
  const [submissionsInsights, setSubmissionsInsights] = useState<number[]>([]);

  // Handlers
  const fetchAssignmentsInsights = () => {
    return DB.from("users")
      .select("courses(lessons(assignments(timestamp:created_at)))")
      .eq("id", user.id)
      .gte(
        "courses.lessons.assignments.created_at",
        format(addDays(subWeeks(new Date(), 1), 1), "yyyy-MM-dd'T'HH:mm:ss")
      )
      .lte(
        "courses.lessons.assignments.created_at",
        format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
      )
      .single();
  };
  const fetchSubmissionsInsights = () => {
    return DB.from("submissions")
      .select("timestamp:created_at")
      .eq("user_id", user.id)
      .gte(
        "created_at",
        format(addDays(subWeeks(new Date(), 1), 1), "yyyy-MM-dd'T'HH:mm:ss")
      )
      .lte("created_at", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"));
  };

  // Effects
  useEffect(() => {
    (async () => {
      const [submissionsData, assignmentsData] = await Promise.all([
        fetchSubmissionsInsights(),
        fetchAssignmentsInsights(),
      ]);

      if (submissionsData.data) {
        setSubmissionsInsights(
          Object.values(parseInsights(submissionsData.data))
        );
      }
      if (assignmentsData.data.courses[0]?.lessons[0]?.assignments) {
        setAssignmentsInsights(
          Object.values(
            parseInsights(
              assignmentsData.data.courses[0].lessons[0].assignments
            )
          )
        );
      }

      if (assignmentsData.error || submissionsData.error)
        toast.error("Something went wrong");
    })();
  }, []);

  return (
    <div>
      <p className="section-title">Insights</p>
      <div className="flex gap-5 flex-col md:flex-row">
        {assignmentsInsights.length ? (
          <Insight
            shouldCalcRightSide={false}
            label="Assignments"
            data={assignmentsInsights}
            labels={getWeekNames()}
          />
        ) : (
          <div className="flex-1">
            <ChartSkeleton record="Assignments" />
          </div>
        )}
        {submissionsInsights.length ? (
          <Insight
            shouldCalcRightSide={false}
            label="Submissions"
            data={submissionsInsights}
            labels={getWeekNames()}
          />
        ) : (
          <div className="flex-1">
            <ChartSkeleton record="Submissions" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentInsights;
