import EditSubmissionModal from "@/components/common/modals/edit-submission-modal";
import ViewSubmissionModal from "@/components/common/modals/view-submission-modal";
import IconTitle from "@/components/icon-title";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import Table from "@/components/table";
import { useUser } from "@/hooks/use-user";
import { Role } from "@/interfaces/user.interface";
import type { SubmissionWithAuthor } from "@/types/submissions.type";
import { format } from "date-fns";
import Link from "next/link";

import { useState, type FunctionComponent } from "react";

interface IProps {
  submissions: SubmissionWithAuthor[];
  onDone: () => void;
  isAssignmentPastDue: boolean;
}

const SubmissionsTab: FunctionComponent<IProps> = ({
  submissions,
  isAssignmentPastDue,
  onDone,
}) => {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>();
  const [isViewSubmissonModalOpen, setIsViewSubmissonModalOpen] =
    useState(false);

  const { user } = useUser();

  return (
    <div className="overflow-hidden">
      <Table
        compact
        data={submissions.map(({ id, author, title, grade, created_at }) => ({
          Name: (
            <IconTitle
              Icon={<SubmissionsIcon size="sm" />}
              key={id}
              title={title}
              subtitle=""
              onClick={() => {
                setSelectedSubmissionId(id);
                setIsViewSubmissonModalOpen(true);
              }}
            />
          ),
          Author: (
            <Link className="text-sm" href={`/users/${author.id}`}>
              {author.name}
            </Link>
          ),
          Grade: <p className="text-sm">{grade}</p>,
          Submitted: (
            <p className="text-sm">
              {format(new Date(created_at), "EEEE, MMM d")}
            </p>
          ),
        }))}
      />
      {user.role === Role.Teacher ? (
        <ViewSubmissionModal
          isOpen={isViewSubmissonModalOpen}
          setIsOpen={setIsViewSubmissonModalOpen}
          onDone={onDone}
          submissionId={selectedSubmissionId}
        />
      ) : (
        <EditSubmissionModal
          isOpen={isViewSubmissonModalOpen}
          setIsOpen={setIsViewSubmissonModalOpen}
          onDone={onDone}
          submissionId={selectedSubmissionId}
          isAssignmentPastDue={isAssignmentPastDue}
        />
      )}
    </div>
  );
};

export default SubmissionsTab;
