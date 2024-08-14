"use client";

import OverviewTab from "@/components/common/modals/edit-assignment-modal/tabs/overview-tab";
import SubmissionsTab from "@/components/common/modals/edit-assignment-modal/tabs/submissions-tab";
import OverviewIcon from "@/components/icons/dashboard-icon";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import Tabs from "@/components/tabs";
import { supabaseClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";

import BaseModal from "@/components/common/modals/base-modal";
import type { Assignment } from "@/types/assignments.type";
import type { SubmissionWithAuthor } from "@/types/submissions.type";
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

  const saveAssignment = async (_assignment: Assignment) => {
    const { error } = await supabaseClient
      .from("assignments")
      .update(_assignment)
      .eq("id", _assignment.id);

    if (error) {
      toast(error.message);
    } else {
      toast("Assignment saved");
      onDone();
      setIsOpen(false);
    }
  };

  const getSubmissions = () => {
    return supabaseClient
      .from("submissions")
      .select("*, author:users(*)")
      .eq("assignment_id", assignmentId);
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await getSubmissions();

      if (error) {
        toast(error.message);
      } else {
        setSubmissions(data);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabaseClient
        .from("assignments")
        .select("*")
        .eq("id", assignmentId)
        .single();

      setAssignment(data);
    })();
  }, []);

  return (
    <BaseModal
      width="lg"
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      title="Assignment"
    >
      <div className="min-h-[523px]">
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
