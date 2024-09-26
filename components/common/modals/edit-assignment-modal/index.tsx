"use client";

import OverviewTab from "@/components/common/modals/edit-assignment-modal/tabs/overview-tab";
import SubmissionsTab from "@/components/common/modals/edit-assignment-modal/tabs/submissions-tab";
import OverviewIcon from "@/components/icons/dashboard-icon";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import Tabs from "@/components/tabs";

import BaseModal from "@/components/common/modals/base-modal";
import type { View } from "@/types/view.type";
import type { FunctionComponent } from "react";

interface Props {
  assignmentId: string;
  onClose: (mutated?: boolean) => void;
  onSubmissionCreated?: () => void;
  view: View;
}

const EditAssignmentModal: FunctionComponent<Props> = ({
  view,
  assignmentId,
  onClose,
  onSubmissionCreated,
}) => {
  return (
    <BaseModal width="lg" onClose={() => onClose()} title="View assignment">
      <div className="">
        <Tabs
          tabs={[
            {
              title: "Overview",
              Icon: <OverviewIcon />,
              content: (
                <OverviewTab
                  view={view}
                  assignmentId={assignmentId}
                  onSubmissionCreated={onSubmissionCreated}
                  onAssignmentUpdated={() => onClose(true)}
                />
              ),
            },
            {
              title: "Submissions",
              Icon: <SubmissionsIcon />,
              content: (
                <SubmissionsTab view={view} assignmentId={assignmentId} />
              ),
            },
          ]}
        />
      </div>
    </BaseModal>
  );
};

export default EditAssignmentModal;
