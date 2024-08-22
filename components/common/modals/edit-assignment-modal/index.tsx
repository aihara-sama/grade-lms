"use client";

import OverviewTab from "@/components/common/modals/edit-assignment-modal/tabs/overview-tab";
import SubmissionsTab from "@/components/common/modals/edit-assignment-modal/tabs/submissions-tab";
import OverviewIcon from "@/components/icons/dashboard-icon";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import Tabs from "@/components/tabs";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";

import BaseModal from "@/components/common/modals/base-modal";
import { getAssignmentByAssignmentId, updateAssignment } from "@/db/assignment";
import { getSubmissionsWithAuthorByAssignmentId } from "@/db/submission";
import type { Assignment } from "@/types/assignments.type";
import type { SubmissionWithAuthor } from "@/types/submissions.type";
import { useTranslations } from "next-intl";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";

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
  const [assignment, setAssignment] = useState<Assignment>();
  const [submissions, setSubmissions] = useState<SubmissionWithAuthor[]>([]);

  const t = useTranslations();

  const saveAssignment = async (_assignment: Assignment) => {
    try {
      await updateAssignment(_assignment);

      toast(t("assignment_updated"));
      setIsOpen(false);
      onDone();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getSubmissions = async () => {
    try {
      setSubmissions(
        await getSubmissionsWithAuthorByAssignmentId(assignmentId)
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getAssignment = async () => {
    try {
      setAssignment(await getAssignmentByAssignmentId(assignmentId));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isOpen) getSubmissions();
  }, []);

  useEffect(() => {
    if (isOpen) getAssignment();
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
                <OverviewTab assignment={assignment} onDone={saveAssignment} />
              ),
            },
            {
              title: "Submissions",
              Icon: <SubmissionsIcon />,
              content: <SubmissionsTab submissions={submissions} />,
            },
          ]}
        />
      </div>
    </BaseModal>
  );
};

export default EditAssignmentModal;
