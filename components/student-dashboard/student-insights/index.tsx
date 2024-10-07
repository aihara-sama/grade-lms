"use client";

import Insight from "@/components/course/insight";
import ChartSkeleton from "@/components/skeletons/chart-skeleton";
import { getWeekNames } from "@/utils/date/get-week-names";
import type { FunctionComponent } from "react";

interface Props {
  assignmentsInsights: number[];
  submissionsInsights: number[];
}

const StudentInsights: FunctionComponent<Props> = ({
  assignmentsInsights,
  submissionsInsights,
}) => {
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
