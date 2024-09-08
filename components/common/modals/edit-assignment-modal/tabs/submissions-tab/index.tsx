import CardTitle from "@/components/card-title";
import EditSubmissionModal from "@/components/common/modals/edit-submission-modal";
import PromptModal from "@/components/common/modals/prompt-modal";
import ViewSubmissionModal from "@/components/common/modals/view-submission-modal";
import CheckIcon from "@/components/icons/check-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import NoDataIcon from "@/components/icons/no-data-icon";
import NotFoundIcon from "@/components/icons/not-found-icon";
import SearchIcon from "@/components/icons/search-icon";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import Input from "@/components/input";
import Skeleton from "@/components/skeleton";
import Table from "@/components/table";
import { SUBMISSIONS_GET_LIMIT } from "@/constants";
import {
  deleteAllMySubmissions,
  deleteSubmissionById,
  deleteSubmissionsByIds,
  getAssignmentSubmissions,
  getAssignmentSubmissionsCount,
  getUserSubmissions,
  getUserSubmissionsCount,
} from "@/db/submission";
import { useUser } from "@/hooks/use-user";
import { Role } from "@/interfaces/user.interface";
import type { SubmissionWithAuthor } from "@/types/submissions.type";
import { throttleFetch } from "@/utils/throttle-fetch";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
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
  // States
  const [isDelSubmissionsModal, setIsDelSubmissionsModal] = useState(false);
  const [isDelSubmissionModal, setIsDelSubmissionModal] = useState(false);

  const [submissions, setSubmissions] = useState<SubmissionWithAuthor[]>([]);
  const [submissionId, setSubmissionId] = useState<string>();
  const [submissionsIds, setSubmissionsIds] = useState<string[]>([]);
  const [submissionsCount, setSubmissionsCount] = useState(0);

  const [searchText, setSearchText] = useState("");

  const [isSelectedAll, setIsSelectedAll] = useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isSubmittingDelSubmission, setIsSubmittingDelSubmission] =
    useState(false);
  const [isSubmittingDelSubmissions, setIsSubmittingDelSubmissions] =
    useState(false);

  // Hooks
  const t = useTranslations();
  const { user } = useUser();

  // Refs
  const submissionsOffsetRef = useRef(0);

  // Vars
  const isData = !!submissions.length && !isLoading;
  const isNoData =
    !isLoading && !isSearching && !submissionsCount && !searchText.length;

  const isNotFound =
    !isLoading && !isSearching && !submissions.length && !!searchText.length;

  // Handlers
  const selectAllMembers = () => {
    setSubmissionsIds(submissions.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllMembers = () => {
    setSubmissionsIds([]);
    setIsSelectedAll(false);
  };

  const fetchInitialSubmissions = async () => {
    setIsLoading(true);

    try {
      const [fetchedSubmissions, fetchedSubmissionsCount] = await Promise.all([
        user.role === Role.Teacher
          ? getAssignmentSubmissions(assignmentId)
          : getUserSubmissions(user.id, assignmentId),

        user.role === Role.Teacher
          ? getAssignmentSubmissionsCount(assignmentId)
          : getUserSubmissionsCount(user.id, assignmentId),
      ]);

      setSubmissions(fetchedSubmissions);
      setSubmissionsCount(fetchedSubmissionsCount);

      submissionsOffsetRef.current = fetchedSubmissions.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchSubmissionsBySearch = async (refetch?: boolean) => {
    setIsSearching(true);

    try {
      const [fetchedSubmissions, fetchedSubmissionsCount] = await Promise.all([
        user.role === Role.Teacher
          ? getAssignmentSubmissions(assignmentId, searchText)
          : getUserSubmissions(user.id, assignmentId, searchText),

        user.role === Role.Teacher
          ? getAssignmentSubmissionsCount(assignmentId, searchText)
          : getUserSubmissionsCount(user.id, assignmentId, searchText),
      ]);

      setSubmissions(fetchedSubmissions);
      setSubmissionsCount(fetchedSubmissionsCount);

      setIsSelectedAll(false);
      setSubmissionsIds([]);

      submissionsOffsetRef.current += refetch ? fetchedSubmissions.length : 0;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSearching(false);
    }
  };
  const fetchMoreSubmissions = async () => {
    try {
      const from = submissionsOffsetRef.current;
      const to = submissionsOffsetRef.current + SUBMISSIONS_GET_LIMIT - 1;

      const fetchedSubmissions = await (user.role === Role.Teacher
        ? getAssignmentSubmissions(assignmentId, searchText, from, to)
        : getUserSubmissions(user.id, assignmentId, searchText, from, to));

      setSubmissions((prev) => [...prev, ...fetchedSubmissions]);

      if (isSelectedAll) {
        setSubmissionsIds((prev) => [
          ...prev,
          ...fetchedSubmissions.map(({ id }) => id),
        ]);
      }

      submissionsOffsetRef.current += fetchedSubmissions.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitDeleteSubmission = async () => {
    setIsSubmittingDelSubmission(true);

    try {
      await deleteSubmissionById(submissionId);

      setIsDelSubmissionModal(false);
      setSubmissionsIds((_) => _.filter((id) => id !== submissionId));
      fetchSubmissionsBySearch(true);

      toast.success(t("submission_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDelSubmission(false);
    }
  };
  const submitDeleteSubmissions = async () => {
    setIsSubmittingDelSubmissions(true);

    try {
      await (isSelectedAll
        ? deleteAllMySubmissions(user.id, searchText)
        : deleteSubmissionsByIds(submissionsIds));

      setSubmissionsIds([]);
      setIsDelSubmissionsModal(false);
      fetchSubmissionsBySearch(true);

      toast.success(t("submissions_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDelSubmissions(false);
    }
  };

  const onScrollEnd = useCallback(throttleFetch(fetchMoreSubmissions), []);

  const onSubmissionToggle = (checked: boolean, lessonId: string) => {
    if (checked) {
      setSubmissionsIds((prev) => [...prev, lessonId]);
      setIsSelectedAll(submissionsCount === submissionsIds.length + 1);
    } else {
      setSubmissionsIds((prev) => prev.filter((_id) => _id !== lessonId));
      setIsSelectedAll(submissionsCount === submissionsIds.length - 1);
    }
  };

  const onSubmissionModalClose = (mutated?: boolean) => {
    setSubmissionId(undefined);

    if (mutated) {
      fetchSubmissionsBySearch(true);
    }
  };

  useEffect(() => {
    if (searchText) {
      fetchSubmissionsBySearch();
    } else {
      fetchInitialSubmissions();
    }
  }, [searchText]);
  return (
    <div className="overflow-hidden">
      {submissionsIds.length ? (
        <div className="mb-3 gap-2 flex">
          <button
            onClick={isSelectedAll ? deselectAllMembers : selectAllMembers}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAll ? submissionsCount : submissionsIds.length}{" "}
            {isSelectedAll ? `Deselect` : "Select all"} <CheckIcon size="xs" />
          </button>
          <button
            onClick={() => setIsDelSubmissionsModal(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Delete <DeleteIcon />
          </button>
        </div>
      ) : (
        <Input
          Icon={<SearchIcon size="xs" />}
          placeholder={t("search")}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-auto"
          value={searchText}
        />
      )}
      {isLoading && <Skeleton />}

      {isData && (
        <Table
          onScrollEnd={onScrollEnd}
          compact
          data={submissions.map(({ id, author, title, grade, created_at }) => ({
            Name: (
              <CardTitle
                checkboxSize="sm"
                checked={submissionsIds.includes(id)}
                Icon={<SubmissionsIcon size="sm" />}
                key={id}
                title={title}
                subtitle=""
                onClick={() => setSubmissionId(id)}
                onToggle={
                  user.role === Role.Student
                    ? (checked) => onSubmissionToggle(checked, id)
                    : undefined
                }
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
      )}
      {isNoData && (
        <div className="flex justify-center mt-12">
          <div className="flex flex-col items-center">
            <NoDataIcon size="xl" />
            <p className="mt-4 font-bold">View your work in a list</p>
          </div>
        </div>
      )}
      {isNotFound && (
        <div className="flex justify-center mt-12">
          <div className="flex flex-col items-center">
            <NotFoundIcon size="xl" />
            <p className="mt-4 font-bold">
              It looks like we can&apos;t find any results for that match
            </p>
          </div>
        </div>
      )}

      {isDelSubmissionModal && (
        <PromptModal
          isSubmitting={isSubmittingDelSubmission}
          title="Delete submission"
          action="Delete"
          body={t("prompts.delete_submission")}
          actionHandler={submitDeleteSubmission}
          onClose={() => setIsDelSubmissionModal(false)}
        />
      )}
      {isDelSubmissionsModal && (
        <PromptModal
          isSubmitting={isSubmittingDelSubmissions}
          onClose={() => setIsDelSubmissionsModal(false)}
          title="Delete submissions"
          action="Delete"
          body={t("prompts.delete_submissions")}
          actionHandler={submitDeleteSubmissions}
        />
      )}

      {user.role === Role.Teacher && submissionId && (
        <ViewSubmissionModal
          onClose={onSubmissionModalClose}
          submissionId={submissionId}
        />
      )}
      {user.role === Role.Student && submissionId && (
        <EditSubmissionModal
          onClose={onSubmissionModalClose}
          submissionId={submissionId}
        />
      )}
    </div>
  );
};
export default SubmissionsTab;
