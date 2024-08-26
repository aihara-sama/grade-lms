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
import {
  getSubmissionsWithAuthorByAssignmentId,
  getSubmissionsWithAuthorByAssignmentIdAndUserId,
} from "@/db/submission";
import type { IUserMetadata } from "@/interfaces/user.interface";
import { Role } from "@/interfaces/user.interface";
import type { Assignment } from "@/types/assignments.type";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";
import type { SubmissionWithAuthor } from "@/types/submissions.type";
import type { User } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  assignmentId: string;
  onDone: () => void;
  user: User;
  course: Course;
  lesson: Lesson;
}

const EditAssignmentModal: FunctionComponent<IProps> = ({
  assignmentId,
  onDone,
  isOpen,
  setIsOpen,
  user,
  course,
  lesson,
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
        await ((user.user_metadata as IUserMetadata).role === Role.Teacher
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

  const getAssignment = async () => {
    try {
      setAssignment(await getAssignmentByAssignmentId(assignmentId));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isOpen) getSubmissions();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) getAssignment();
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
                  onSubmissionCreated={getSubmissions}
                  course={course}
                  user={user}
                  assignment={assignment}
                  onAssignmentCreatedDone={saveAssignment}
                  lesson={lesson}
                />
              ),
              tier: [Role.Teacher, Role.Student],
            },
            {
              title: "Submissions",
              Icon: <SubmissionsIcon />,
              content: (
                <SubmissionsTab
                  user={user}
                  onDone={getSubmissions}
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
