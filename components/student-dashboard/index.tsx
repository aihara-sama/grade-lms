"use client";

import DashboardSchedule from "@/components/common/dashboard/dashboard-schedule";
import Container from "@/components/container";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import LatestAssignments from "@/components/student-dashboard/latest-assignments";
import StudentInsights from "@/components/student-dashboard/student-insights";
import Total from "@/components/total";
import type { getLatestAssignments } from "@/db/server/assignment";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useUser } from "@/hooks/use-user";
import type { ResultOf } from "@/types/utils.type";
import { useEffect, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  assignmentsCount: number;
  submissionsCount: number;
  latestAssignments: ResultOf<typeof getLatestAssignments>;
}

const StudentrDashboard: FunctionComponent<Props> = ({
  assignmentsCount,
  submissionsCount,
  latestAssignments,
}) => {
  const user = useUser((state) => state.user);
  const { enablePushNotifications } = usePushNotifications();

  useEffect(() => {
    (async () => {
      if (user.push_notifications_state === "Idle") {
        try {
          const permission = await Notification.requestPermission();

          if (permission === "granted") await enablePushNotifications();

          toast.success("Notifications enabled!");
        } catch (err: any) {
          console.error(err.message);
        }
      }
    })();
  }, []);

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
          <DashboardSchedule />
        </div>
      </div>
    </Container>
  );
};

export default StudentrDashboard;
