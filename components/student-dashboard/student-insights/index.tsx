"use client";

import Insight from "@/components/course/insight";
import ChartSkeleton from "@/components/skeletons/chart-skeleton";
import { getAssignmentsInsights } from "@/db/client/assignment";
import { getSubmissionsInsights } from "@/db/client/submission";
import { getWeekNames } from "@/utils/date/get-week-names";
import { parseInsights } from "@/utils/parse/parse-insights";
import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const StudentInsights: FunctionComponent = () => {
  // State
  const [assignmentsInsights, setAssignmentsInsights] = useState<number[]>([]);
  const [submissionsInsights, setSubmissionsInsights] = useState<number[]>([]);

  // Effects
  useEffect(() => {
    (async () => {
      try {
        const [
          { data: newAssignmentsInsights },
          { data: newSubmissionsInsights },
        ] = await Promise.all([
          getAssignmentsInsights(),
          getSubmissionsInsights(),
        ]);

        if (newAssignmentsInsights.length) {
          setAssignmentsInsights(
            Object.values(parseInsights(newAssignmentsInsights))
          );
        }
        if (newSubmissionsInsights.length) {
          setSubmissionsInsights(
            Object.values(parseInsights(newSubmissionsInsights))
          );
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, []);

  // View
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
