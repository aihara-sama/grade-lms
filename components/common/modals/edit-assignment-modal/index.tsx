"use client";

import OverviewTab from "@/components/common/modals/edit-assignment-modal/tabs/overview-tab";
import SubmissionsTab from "@/components/common/modals/edit-assignment-modal/tabs/submissions-tab";
import OverviewIcon from "@/components/icons/dashboard-icon";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import Tabs from "@/components/tabs";
import toast from "react-hot-toast";

import BaseModal from "@/components/common/modals/base-modal";
import { getAssignmentByAssignmentId, updateAssignment } from "@/db/assignment";
import {
  getSubmissionsWithAuthorByAssignmentId,
  getSubmissionsWithAuthorByAssignmentIdAndUserId,
} from "@/db/submission";
import { useUser } from "@/hooks/use-user";
import { Role } from "@/interfaces/user.interface";
import type { ResultOf } from "@/types";
import type { SubmissionWithAuthor } from "@/types/submissions.type";
import type { TablesUpdate } from "@/types/supabase.type";
import { useTranslations } from "next-intl";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useEffect, useState } from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  assignmentId: string;
  onDone: () => void;
}

const EditAssignmentModal: FunctionComponent<IProps> = ({
  assignmentId,
  onDone,
  isOpen,
  setIsOpen,
}) => {
  const [assignment, setAssignment] =
    useState<ResultOf<typeof getAssignmentByAssignmentId>>();
  const [submissions, setSubmissions] = useState<SubmissionWithAuthor[]>([]);

  const t = useTranslations();
  const { user } = useUser();

  const submitUpdateAssignment = async (
    assignmentUpdate: TablesUpdate<"assignments">
  ) => {
    try {
      await updateAssignment(assignmentUpdate);

      toast(t("assignment_updated"));
      setIsOpen(false);
      onDone();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setSubmissions(
        await (user.role === Role.Teacher
          ? getSubmissionsWithAuthorByAssignmentId(assignmentId)
          : getSubmissionsWithAuthorByAssignmentIdAndUserId(
              assignmentId,
              user.id
            ))
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchAssignment = async () => {
    try {
      setAssignment(await getAssignmentByAssignmentId(assignmentId));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isOpen) fetchSubmissions();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) fetchAssignment();
    else setAssignment(undefined);
  }, [isOpen]);

  return (
    <BaseModal
      width="lg"
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      title="Assignment"
    >
      <div className="">
        <Tabs
          tabs={[
            {
              title: "Overview",
              Icon: <OverviewIcon />,
              content: assignment && (
                <OverviewTab
                  assignment={assignment}
                  onSubmissionCreated={fetchSubmissions}
                  submitUpdateAssignment={submitUpdateAssignment}
                />
              ),
              tier: [Role.Teacher, Role.Student],
            },
            {
              title: "Submissions",
              Icon: <SubmissionsIcon />,
              content: (
                <SubmissionsTab
                  onDone={fetchSubmissions}
                  submissions={submissions}
                />
              ),
              tier: [Role.Teacher, Role.Student],
            },
          ]}
        />
      </div>
    </BaseModal>
  );
};

export default EditAssignmentModal;
