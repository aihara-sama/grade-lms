"use client";

import OverviewIcon from "@/components/icons/dashboard-icon";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import Modal from "@/components/modal";
import OverviewTab from "@/components/modals/assignment-modal/tabs/overview-tab";
import SubmissionsTab from "@/components/modals/assignment-modal/tabs/submissions-tab";
import Tabs from "@/components/tabs";
import type { Assignment } from "@/types/assignments.type";
import { supabaseClient } from "@/utils/supabase/client";
import { useEffect, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

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
              content: <SubmissionsTab submissions={[]} />,
            },
          ]}
        />
      }
    />
  );
};

export default AssignmentModal;
