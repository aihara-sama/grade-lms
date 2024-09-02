"use client";

import CardsContainer from "@/components/cards-container";
import DashboardSchedule from "@/components/common/dashboard/dashboard-schedule";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import LatestAssignments from "@/components/student-dashboard/latest-assignments";
import StudentInsights from "@/components/student-dashboard/student-insights";
import Total from "@/components/total";
import type { Assignment } from "@/types/assignments.type";
import { db } from "@/utils/supabase/client";
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
    db
      .from("users")
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
    <div className="flex gap-8">
      <div className="flex-1 overflow-hidden">
        <CardsContainer>
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
        </CardsContainer>
        <hr className="my-4" />
        <LatestAssignments assignments={latestAssignments} />
        <StudentInsights user={user} />
      </div>
      <div className="w-[278px]">
        <DashboardSchedule />
      </div>
    </div>
  );
};

export default StudentrDashboard;
