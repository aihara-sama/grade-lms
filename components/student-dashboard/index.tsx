"use client";

import DashboardSchedule from "@/components/common/dashboard/dashboard-schedule";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import LatestAssignments from "@/components/student-dashboard/latest-assignments";
import StudentInsights from "@/components/student-dashboard/student-insights";
import Total from "@/components/total";
import { DB } from "@/lib/supabase/db";
import type { Assignment } from "@/types/assignment.type";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  user: User;
  totalAssignmentsCount: number;
  totalSubmissionsCount: number;
}

const StudentrDashboard: FunctionComponent<Props> = ({
  user,
  totalSubmissionsCount,
  totalAssignmentsCount,
}) => {
  const [submissionsCount] = useState(totalSubmissionsCount);
  const [assignmentsCount] = useState(totalAssignmentsCount);
  const [latestAssignments, setLatestAssignments] = useState<Assignment[]>([]);

  const fetchLatestAssignments = () =>
    DB.from("users")
      .select("courses(lessons(assignments(*)))")
      .eq("id", user.id)
      .limit(10)
      .returns<
        Record<"courses", { lessons: { assignments: Assignment[] }[] }[]>[]
      >()
      .single();

  useEffect(() => {
    (async () => {
      const { data, error } = await fetchLatestAssignments();

      if (error) {
        toast.error("Something went wrong");
      } else {
        setLatestAssignments(data.courses[0]?.lessons[0]?.assignments || []);
      }
    })();
  }, []);

  return (
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
        <LatestAssignments assignments={latestAssignments} />
        <StudentInsights user={user} />
      </div>
      <div className="sm:w-[300px]">
        <DashboardSchedule />
      </div>
    </div>
  );
};

export default StudentrDashboard;
