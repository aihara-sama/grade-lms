"use client";

import DashboardSchedule from "@/components/common/dashboard/dashboard-schedule";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import LatestAssignments from "@/components/student-dashboard/latest-assignments";
import StudentInsights from "@/components/student-dashboard/student-insights";
import Total from "@/components/total";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useUser } from "@/hooks/use-user";
import type { Assignment } from "@/types/assignment.type";
import { useEffect, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  assignmentsCount: number;
  submissionsCount: number;
  latestAssignments: Assignment[];
}

const StudentrDashboard: FunctionComponent<Props> = (props) => {
  const { enablePushNotifications } = usePushNotifications();
  const { user } = useUser();

  useEffect(() => {
    (async () => {
      if (!user.is_push_notifications_on) {
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
    <div className="sm:flex-row flex gap-8 flex-col">
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-wrap gap-6 [&>*]:[@media(min-width:919px)]:w-64">
          <Total
            Icon={<AssignmentsIcon size="lg" />}
            total={props.assignmentsCount}
            title="Total assignments"
          />
          <Total
            Icon={<SubmissionsIcon size="lg" />}
            total={props.submissionsCount}
            title="Total submissions"
          />
        </div>
        <hr className="my-4" />
        <LatestAssignments assignments={props.latestAssignments} />
        <StudentInsights />
      </div>
      <div className="sm:w-[300px]">
        <DashboardSchedule />
      </div>
    </div>
  );
};

export default StudentrDashboard;
