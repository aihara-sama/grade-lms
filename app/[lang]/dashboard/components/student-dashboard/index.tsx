"use client";

import DashboardSchedule from "@/app/[lang]/dashboard/components/common/dashboard-schedule";
import LatestAssignments from "@/app/[lang]/dashboard/components/student-dashboard/latest-assignments";
import StudentInsights from "@/app/[lang]/dashboard/components/student-dashboard/student-insights";
import ViewAssignmentModal from "@/components/common/modals/edit-assignment-modal";
import Total from "@/components/common/total";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import Container from "@/components/layout/container";
import { getAssignmentsInsights } from "@/db/client/assignment";
import { getSubmissionsInsights } from "@/db/client/submission";
import type { getLatestAssignments } from "@/db/server/assignment";
import type { getDayLessons } from "@/db/server/lesson";
import type { ResultOf } from "@/types/utils.type";
import { parseInsights } from "@/utils/parse/parse-insights";
import { useTranslations } from "next-intl";
import { useEffect, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  assignmentsCount: number;
  submissionsCount: number;
  latestAssignments: ResultOf<typeof getLatestAssignments>;
  dayLessons: ResultOf<typeof getDayLessons>;
}

const StudentDashboard: FunctionComponent<Props> = ({
  assignmentsCount,
  submissionsCount: initSubmissionsCount,
  latestAssignments,
  dayLessons,
}) => {
  // Hooks
  const t = useTranslations();

  // State
  const [assignmentsInsights, setAssignmentsInsights] = useState<number[]>([]);
  const [submissionsInsights, setSubmissionsInsights] = useState<number[]>([]);

  const [assignmentId, setAssignmentId] = useState<string>();
  const [submissionsCount, setSubmissionsCount] =
    useState(initSubmissionsCount);

  // Handlers
  const getInsights = async () => {
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
  };

  const onSubmissionCreated = async () => {
    await getInsights();
    setSubmissionsCount((prev) => prev + 1);
  };

  // Effects
  useEffect(() => {
    getInsights();
  }, []);

  // View
  return (
    <Container>
      <p className="page-title">{t("dashboard.title")}</p>
      <p className="text-neutral-500 mb-4">{t("dashboard.sub_title")}</p>
      <div className="sm:flex-row flex gap-8 flex-col">
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-wrap gap-6 [&>*]:[@media(min-width:919px)]:w-64">
            <Total
              adaptive={false}
              Icon={<AssignmentsIcon size="lg" />}
              total={assignmentsCount}
              title={t("cards.titles.total_assignments")}
            />
            <Total
              adaptive={false}
              Icon={<SubmissionsIcon size="lg" />}
              total={submissionsCount}
              title={t("cards.titles.total_submissions")}
            />
          </div>
          <hr className="my-4" />
          <LatestAssignments
            assignments={latestAssignments.data}
            onAssignmentClick={setAssignmentId}
          />
          <StudentInsights
            assignmentsInsights={assignmentsInsights}
            submissionsInsights={submissionsInsights}
          />
        </div>
        <div className="sm:w-[284px]">
          <DashboardSchedule dayLessons={dayLessons} />
        </div>
      </div>
      {assignmentId && (
        <ViewAssignmentModal
          assignmentId={assignmentId}
          onSubmissionCreated={onSubmissionCreated}
          onClose={() => setAssignmentId(undefined)}
        />
      )}
    </Container>
  );
};

export default StudentDashboard;
