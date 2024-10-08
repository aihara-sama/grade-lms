import TitleCard from "@/components/common/cards/title-card";
import BasicInput from "@/components/common/inputs/basic-input";
import EditSubmissionModal from "@/components/common/modals/edit-submission-modal";
import PromptDeleteRecordModal from "@/components/common/modals/prompt-delete-record-modal";
import PromptDeleteRecordsModal from "@/components/common/modals/prompt-delete-records-modal";
import ViewSubmissionModal from "@/components/common/modals/view-submission-modal";
import NotFound from "@/components/common/not-found";
import BasicPopper from "@/components/common/poppers/basic-popper";
import Table from "@/components/common/table";
import CheckIcon from "@/components/icons/check-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import SearchIcon from "@/components/icons/search-icon";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import LoadingSkeleton from "@/components/utilities/skeletons/loading-skeleton";
import { SUBMISSIONS_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import {
  deleteAllSubmissions,
  deleteSubmission,
  deleteSubmissions,
  getAssignmentSubmissions,
} from "@/db/client/submission";
import useFetchLock from "@/hooks/use-fetch-lock";
import { useUser } from "@/hooks/use-user";
import type { SubmissionWithAuthor } from "@/types/submission.type";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import { throttleSearch } from "@/utils/throttle/throttle-search";
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
  // Hooks
  const t = useTranslations();
  const user = useUser((state) => state.user);

  const fetchLock = useFetchLock();

  // States
  const [isDelSubmissionModal, setIsDelSubmissionModal] = useState(false);
  const [isDelSubmissionsModal, setIsDelSubmissionsModal] = useState(false);
  const [isEditSubmissionModal, setIsEditSubmissionModal] = useState(false);
  const [isViewSubmissionModal, setIsViewSubmissionModal] = useState(false);

  const [submissions, setSubmissions] = useState<SubmissionWithAuthor[]>([]);
  const [submissionsCount, setSubmissionsCount] = useState(0);

  const [submissionId, setSubmissionId] = useState<string>();
  const [submissionsIds, setSubmissionsIds] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [isSelectedAll, setIsSelectedAll] = useState(false);

  // Refs
  const submissionsOffsetRef = useRef(0);

  // Vars
  const isData = !!submissions.length && !isLoading;
  const isNoData =
    !isLoading && !isSearching && !submissionsCount && !searchText.length;

  const isNotFound = !isLoading && !submissions.length && !!searchText.length;

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
      const { data, count } = await (user.role === "Teacher"
        ? getAssignmentSubmissions(assignmentId)
        : getAssignmentSubmissions(assignmentId));

      setSubmissions(data);
      setSubmissionsCount(count);

      submissionsOffsetRef.current = data.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchSubmissionsBySearch = async (search: string) => {
    setIsSearching(true);

    try {
      const { data, count } = await (user.role === "Teacher"
        ? getAssignmentSubmissions(assignmentId, search)
        : getAssignmentSubmissions(assignmentId, search));

      setSubmissions(data);
      setSubmissionsCount(count);

      submissionsOffsetRef.current = data.length;
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

      const { data } = await (user.role === "Teacher"
        ? getAssignmentSubmissions(assignmentId, searchText, from, to)
        : getAssignmentSubmissions(assignmentId, searchText, from, to));

      setSubmissions((prev) => [...prev, ...data]);

      if (isSelectedAll) {
        setSubmissionsIds((prev) => [...prev, ...data.map(({ id }) => id)]);
      }

      submissionsOffsetRef.current += data.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitDeleteSubmission = async () => {
    try {
      await deleteSubmission(submissionId);

      setSubmissions((prev) => prev.filter(({ id }) => id !== submissionId));
      setSubmissionsCount((prev) => prev - 1);

      setSubmissionsIds((_) => _.filter((id) => id !== submissionId));

      setIsDelSubmissionModal(false);

      submissionsOffsetRef.current -= 1;

      toast.success(t("success.submission_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const submitDeleteSubmissions = async () => {
    try {
      if (isSelectedAll) {
        await deleteAllSubmissions(searchText);
        setSubmissions([]);
        setSubmissionsCount(0);
      } else {
        await deleteSubmissions(submissionsIds);
        setSubmissions((prev) =>
          prev.filter(({ id }) => !submissionsIds.includes(id))
        );
        setSubmissionsCount((prev) => prev - submissionsIds.length);
      }

      setSubmissionsIds([]);
      setIsDelSubmissionsModal(false);

      submissionsOffsetRef.current -= submissionsIds.length;

      toast.success(t("success.submissions_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onSubmissionToggle = (checked: boolean, lessonId: string) => {
    if (checked) {
      setSubmissionsIds((prev) => [...prev, lessonId]);
      setIsSelectedAll(submissionsCount === submissionsIds.length + 1);
    } else {
      setSubmissionsIds((prev) => prev.filter((_id) => _id !== lessonId));
      setIsSelectedAll(submissionsCount === submissionsIds.length - 1);
    }
  };

  const onSubmissionClick = (_submissionId: string) => {
    setSubmissionId(_submissionId);

    if (user.role === "Teacher") {
      setIsViewSubmissionModal(true);
    }

    if (user.role === "Student") {
      setIsEditSubmissionModal(true);
    }
  };

  const onEditSubmissionModalClose = (mutated?: boolean) => {
    setSubmissionId(undefined);
    setIsEditSubmissionModal(false);

    if (mutated) {
      fetchSubmissionsBySearch(searchText);
    }
  };
  const onViewSubmissionModalClose = (mutated?: boolean) => {
    setSubmissionId(undefined);
    setIsViewSubmissionModal(false);

    if (mutated) {
      fetchSubmissionsBySearch(searchText);
    }
  };

  const throttledSearch = useCallback(
    throttleSearch((search) => {
      if (search) {
        fetchSubmissionsBySearch(search);
      } else {
        fetchInitialSubmissions();
      }
    }, THROTTLE_SEARCH_WAIT),
    []
  );

  useEffect(() => throttledSearch(searchText), [searchText]);

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
            Delete <DeleteIcon size="xs" />
          </button>
        </div>
      ) : (
        <BasicInput
          StartIcon={<SearchIcon size="xs" />}
          placeholder={t("search")}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-auto"
          value={searchText}
        />
      )}
      {isLoading && <LoadingSkeleton />}

      {isData && (
        <Table
          onScrollEnd={throttleFetch(
            fetchLock("submissions", fetchMoreSubmissions)
          )}
          compact
          data={submissions.map(
            ({ id, author, title, grade, created_at }, idx) => ({
              Name: (
                <TitleCard
                  checkboxSize="sm"
                  checked={submissionsIds.includes(id)}
                  Icon={<SubmissionsIcon size="sm" />}
                  key={id}
                  title={title}
                  subtitle=""
                  onClick={() => onSubmissionClick(id)}
                  onToggle={
                    user.role === "Student"
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
              "": user.role === "Student" && (
                <BasicPopper
                  placement={
                    submissions.length > 7 && submissions.length - idx < 4
                      ? "top"
                      : "bottom"
                  }
                  width="sm"
                  trigger={
                    <button
                      className="icon-button text-neutral-500"
                      onClick={() => setSubmissionId(id)}
                    >
                      <DotsIcon />
                    </button>
                  }
                >
                  <ul className="flex flex-col">
                    <li
                      className="popper-list-item"
                      onClick={() => setIsDelSubmissionModal(true)}
                    >
                      <DeleteIcon size="xs" /> Delete
                    </li>
                  </ul>
                </BasicPopper>
              ),
            })
          )}
        />
      )}
      {(isNoData || isNotFound) && (
        <NotFound variant="secondary" action={null} />
      )}

      {isDelSubmissionModal && (
        <PromptDeleteRecordModal
          title={t("modal.titles.delete_submission")}
          prompt={`${t("prompts.delete_submission")}`}
          record={submissions.find(({ id }) => id === submissionId).title}
          confirmText={t("actions.delete")}
          onClose={() => setIsDelSubmissionModal(false)}
          onConfirm={submitDeleteSubmission}
        />
      )}
      {isDelSubmissionsModal && (
        <PromptDeleteRecordsModal
          title={t("modal.titles.delete_submissions")}
          prompt={`${t("prompts.delete_submissions", {
            count: submissionsIds.length,
          })}`}
          confirmText={t("actions.delete")}
          onClose={() => setIsDelSubmissionsModal(false)}
          onConfirm={submitDeleteSubmissions}
        />
      )}

      {user.role === "Teacher" && isViewSubmissionModal && (
        <ViewSubmissionModal
          onClose={onViewSubmissionModalClose}
          submissionId={submissionId}
        />
      )}
      {user.role === "Student" && isEditSubmissionModal && (
        <EditSubmissionModal
          onClose={onEditSubmissionModalClose}
          submissionId={submissionId}
        />
      )}
    </div>
  );
};
export default SubmissionsTab;
