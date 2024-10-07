"use client";

import DashboardSchedule from "@/components/common/dashboard/dashboard-schedule";
import Container from "@/components/container";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import LatestAssignments from "@/components/student-dashboard/latest-assignments";
import StudentInsights from "@/components/student-dashboard/student-insights";
import Total from "@/components/total";
import type { getLatestAssignments } from "@/db/server/assignment";
import type { getDayLessons } from "@/db/server/lesson";
import type { ResultOf } from "@/types/utils.type";
import { type FunctionComponent } from "react";

interface Props {
  assignmentsCount: number;
  submissionsCount: number;
  latestAssignments: ResultOf<typeof getLatestAssignments>;
  dayLessons: ResultOf<typeof getDayLessons>;
}

const StudentDashboard: FunctionComponent<Props> = ({
  assignmentsCount,
  submissionsCount,
  latestAssignments,
  dayLessons,
}) => {
  return (
    <Container>
      <p className="page-title">Dashboard</p>
      <p className="text-neutral-500 mb-4">Your LMS Command Center</p>
      <div className="sm:flex-row flex gap-8 flex-col">
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-wrap gap-6 [&>*]:[@media(min-width:919px)]:w-64">
            <Total
              Icon={<AssignmentsIcon size="lg" />}
              total={assignmentsCount}
              title="Total assignments"
            />
            <Total
              Icon={<SubmissionsIcon size="lg" />}
              total={submissionsCount}
              title="Total submissions"
            />
          </div>
          <hr className="my-4" />
          <LatestAssignments assignments={latestAssignments.data} />
          <StudentInsights />
        </div>
        <div className="sm:w-[300px]">
          <DashboardSchedule dayLessons={dayLessons} />
        </div>
      </div>
    </Container>
  );
};

export default StudentDashboard;
