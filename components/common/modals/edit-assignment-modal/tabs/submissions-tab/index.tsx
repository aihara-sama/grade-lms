import EditSubmissionModal from "@/components/common/modals/edit-submission-modal";
import ViewSubmissionModal from "@/components/common/modals/view-submission-modal";
import IconTitle from "@/components/icon-title";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import Table from "@/components/table";
import { SUBMISSIONS_GET_LIMIT } from "@/constants";
import {
  getAssignmentSubmissionsWithAuthor,
  getUserSubmissionsWithAuthor,
} from "@/db/submission";
import { useUser } from "@/hooks/use-user";
import { Role } from "@/interfaces/user.interface";
import type { SubmissionWithAuthor } from "@/types/submissions.type";
import { throttleFetch } from "@/utils/throttle-fetch";
import { format } from "date-fns";
import Link from "next/link";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FunctionComponent,
} from "react";
import toast from "react-hot-toast";

interface Props {
  assignmentId: string;
}

const SubmissionsTab: FunctionComponent<Props> = ({ assignmentId }) => {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>();
  const [submissions, setSubmissions] = useState<SubmissionWithAuthor[]>([]);

  const { user } = useUser();

  // Refs
  const submissionsOffsetRef = useRef(0);

  const fetchSubmissions = async () => {
    try {
      const fetchedSubmissions = await (user.role === Role.Teacher
        ? getAssignmentSubmissionsWithAuthor(
            assignmentId,
            submissionsOffsetRef.current,
            submissionsOffsetRef.current + SUBMISSIONS_GET_LIMIT - 1
          )
        : getUserSubmissionsWithAuthor(
            assignmentId,
            user.id,
            submissionsOffsetRef.current,
            submissionsOffsetRef.current + SUBMISSIONS_GET_LIMIT - 1
          ));

      setSubmissions((prev) => [...prev, ...fetchedSubmissions]);
      submissionsOffsetRef.current += fetchedSubmissions.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const onScrollEnd = useCallback(throttleFetch(fetchSubmissions), []);

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
        onScrollEnd={onScrollEnd}
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
