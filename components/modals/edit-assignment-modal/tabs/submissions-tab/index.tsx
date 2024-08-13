import IconTitle from "@/components/icon-title";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import ViewSubmissionModal from "@/components/modals/view-submission-modal";
import Table from "@/components/table";
import type { SubmissionWithAuthor } from "@/types/submissions.type";
import { format } from "date-fns";
import Link from "next/link";

import { useState, type FunctionComponent } from "react";

interface IProps {
  submissions: SubmissionWithAuthor[];
}

const SubmissionsTab: FunctionComponent<IProps> = ({ submissions }) => {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>();
  const [isViewSubmissonModalOpen, setIsViewSubmissonModalOpen] =
    useState(false);

  return (
    <div>
      <Table
        data={submissions.map(({ id, author, title, grade, created_at }) => ({
          Name: (
            <IconTitle
              Icon={<SubmissionsIcon size="sm" />}
              key={id}
              title={title}
              subtitle=""
              onClick={() => setSelectedSubmissionId(id)}
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
      <ViewSubmissionModal
        isOpen={isViewSubmissonModalOpen}
        setIsOpen={setIsViewSubmissonModalOpen}
        onDone={() => {}}
        submissionId={selectedSubmissionId}
      />
    </div>
  );
};

export default SubmissionsTab;
