import TitleCard from "@/components/common/cards/title-card";
import BasicInput from "@/components/common/inputs/basic-input";
import EditSubmissionModal from "@/components/common/modals/edit-submission-modal";
import ViewSubmissionModal from "@/components/common/modals/view-submission-modal";
import NotFound from "@/components/common/not-found";
import Table from "@/components/common/table";
import SearchIcon from "@/components/icons/search-icon";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import LoadingSkeleton from "@/components/utilities/skeletons/loading-skeleton";
import { SUBMISSIONS_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import { getAssignmentSubmissions } from "@/db/client/submission";
import useFetchLock from "@/hooks/use-fetch-lock";
import { useUser } from "@/hooks/use-user";
import type { Locale } from "@/i18n/routing";
import type { ResultOf } from "@/types/utils.type";
import { getDateLocale } from "@/utils/date/get-date-locale";
import { toCapitalCase } from "@/utils/string/to-capital-case";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import { throttleSearch } from "@/utils/throttle/throttle-search";
import { formatDistanceToNow } from "date-fns";
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
  const [isEditSubmissionModal, setIsEditSubmissionModal] = useState(false);
  const [isViewSubmissionModal, setIsViewSubmissionModal] = useState(false);

  const [submissions, setSubmissions] = useState<
    ResultOf<typeof getAssignmentSubmissions>["data"]
  >([]);
  const [submissionsCount, setSubmissionsCount] = useState(0);

  const [submissionId, setSubmissionId] = useState<string>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [searchText, setSearchText] = useState("");

  // Refs
  const submissionsOffsetRef = useRef(0);

  // Vars
  const isData = !!submissions.length && !isLoading;
  const isNoData =
    !isLoading && !isSearching && !submissionsCount && !searchText.length;

  const isNotFound = !isLoading && !submissions.length && !!searchText.length;

  // Handlers
  const fetchInitialSubmissions = async () => {
    setIsLoading(true);

    try {
      const { data, count } = await getAssignmentSubmissions(assignmentId);

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
      const { data, count } = await (user.role === "teacher"
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

      const { data } = await getAssignmentSubmissions(
        assignmentId,
        searchText,
        from,
        to
      );

      setSubmissions((prev) => [...prev, ...data]);

      submissionsOffsetRef.current += data.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onSubmissionClick = (_submissionId: string) => {
    setSubmissionId(_submissionId);

    if (user.role === "teacher") {
      setIsViewSubmissionModal(true);
    }

    if (user.role === "student") {
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
      <BasicInput
        StartIcon={<SearchIcon size="xs" />}
        placeholder={t("placeholders.search")}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-auto"
        value={searchText}
      />

      {isLoading && <LoadingSkeleton />}

      {isData && (
        <Table
          onScrollEnd={throttleFetch(
            fetchLock("submissions", fetchMoreSubmissions)
          )}
          compact
          data={submissions.map(
            ({ id, author, title, grades, created_at }) => ({
              [t("tables.submissions.name")]: (
                <TitleCard
                  checkboxSize="sm"
                  Icon={<SubmissionsIcon size="sm" />}
                  key={id}
                  title={title}
                  subtitle=""
                  onClick={() => onSubmissionClick(id)}
                />
              ),
              [t("tables.submissions.author")]: (
                <Link className="text-sm" href={`/users/${author.id}`}>
                  {author.name}
                </Link>
              ),
              [t("tables.submissions.grade")]: (
                <p className="text-sm">{grades?.[0]?.title}</p>
              ),
              [t("tables.submissions.submitted")]: (
                <p
                  className="text-sm truncate"
                  title={formatDistanceToNow(new Date(created_at), {
                    addSuffix: true,
                    locale: getDateLocale(user.preferred_locale as Locale),
                  })}
                >
                  {toCapitalCase(
                    formatDistanceToNow(new Date(created_at), {
                      addSuffix: true,
                      locale: getDateLocale(user.preferred_locale as Locale),
                    })
                  )}
                </p>
              ),
            })
          )}
        />
      )}
      {(isNoData || isNotFound) && (
        <NotFound variant="secondary" action={null} />
      )}

      {user.role === "teacher" && isViewSubmissionModal && (
        <ViewSubmissionModal
          onClose={onViewSubmissionModalClose}
          submissionId={submissionId}
        />
      )}
      {user.role === "student" && isEditSubmissionModal && (
        <EditSubmissionModal
          onClose={onEditSubmissionModalClose}
          submissionId={submissionId}
        />
      )}
    </div>
  );
};
export default SubmissionsTab;
