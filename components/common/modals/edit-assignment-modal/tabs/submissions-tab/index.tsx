import EditSubmissionModal from "@/components/common/modals/edit-submission-modal";
import ViewSubmissionModal from "@/components/common/modals/view-submission-modal";
import IconTitle from "@/components/icon-title";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import Table from "@/components/table";
import {
  getAssignmentSubmissionsWithAuthor,
  getUserSubmissionsWithAuthor,
} from "@/db/submission";
import { useUser } from "@/hooks/use-user";
import { Role } from "@/interfaces/user.interface";
import type { SubmissionWithAuthor } from "@/types/submissions.type";
import { format } from "date-fns";
import Link from "next/link";

import { useEffect, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  assignmentId: string;
}

const SubmissionsTab: FunctionComponent<Props> = ({ assignmentId }) => {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>();
  const [submissions, setSubmissions] = useState<SubmissionWithAuthor[]>([]);

  const { user } = useUser();

  const fetchSubmissions = async () => {
    try {
      setSubmissions(
        await (user.role === Role.Teacher
          ? getAssignmentSubmissionsWithAuthor(assignmentId)
          : getUserSubmissionsWithAuthor(assignmentId, user.id))
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const onSubmissionModalClose = (mutated?: boolean) => {
    setSelectedSubmissionId(undefined);

    if (mutated) {
      fetchSubmissions();
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

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

      {user.role === Role.Teacher && selectedSubmissionId && (
        <ViewSubmissionModal
          onClose={onSubmissionModalClose}
          submissionId={selectedSubmissionId}
        />
      )}
      {user.role === Role.Student && selectedSubmissionId && (
        <EditSubmissionModal
          onClose={onSubmissionModalClose}
          submissionId={selectedSubmissionId}
        />
      )}
    </div>
  );
};
export default SubmissionsTab;
