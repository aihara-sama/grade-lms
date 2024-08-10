"use client";

import OverviewIcon from "@/components/icons/dashboard-icon";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import Modal from "@/components/modal";
import OverviewTab from "@/components/modals/assignment-modal/tabs/overview-tab";
import SubmissionsTab from "@/components/modals/assignment-modal/tabs/submissions-tab";
import Tabs from "@/components/tabs";
import { supabaseClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";

import type { Assignment } from "@/types/assignments.type";
import type { SubmissionWithAuthor } from "@/types/submissions.type";
import type { FunctionComponent } from "react";

interface IProps {
  assignmentId: string;
  close: () => void;
  onDone: () => void;
}

const AssignmentModal: FunctionComponent<IProps> = ({
  assignmentId,
  close,
  onDone,
}) => {
  const [assignment, setAssignment] = useState<Assignment>();
  const [submissions, setSubmissions] = useState<SubmissionWithAuthor[]>([]);
  console.log({ submissions });

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
      close();
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
    <Modal
      width="lg"
      close={close}
      title="Assignment"
      content={
        <div className="min-h-[523px]">
          <Tabs
            tabs={[
              {
                title: "Overview",
                Icon: <OverviewIcon />,
                content: assignment && (
                  <OverviewTab
                    assignment={assignment}
                    onDone={saveAssignment}
                  />
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
      }
    />
  );
};

export default AssignmentModal;
