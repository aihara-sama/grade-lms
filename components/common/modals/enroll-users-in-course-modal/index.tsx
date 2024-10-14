import Avatar from "@/components/common/avatar";
import TitleCard from "@/components/common/cards/title-card";
import BasicModal from "@/components/common/modals/basic-modal";
import Table from "@/components/common/table";
import type { FunctionComponent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import BasicInput from "@/components/common/inputs/basic-input";
import NotFound from "@/components/common/not-found";
import CheckIcon from "@/components/icons/check-icon";
import SearchIcon from "@/components/icons/search-icon";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import LoadingSkeleton from "@/components/utilities/skeletons/loading-skeleton";
import { THROTTLE_SEARCH_WAIT, USERS_GET_LIMIT } from "@/constants";
import {
  enrollAllUsersInCourses,
  enrollUsersInCourses,
  getUsersNotInCourse,
} from "@/db/client/user";
import useFetchLock from "@/hooks/use-fetch-lock";
import { DB } from "@/lib/supabase/db";
import type { ResultOf } from "@/types/utils.type";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import { throttleSearch } from "@/utils/throttle/throttle-search";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface Props {
  onClose: (usersIds: string[]) => void;
  courseId: string;
}

const EnrollUsersInCourseModal: FunctionComponent<Props> = ({
  courseId,
  onClose,
}) => {
  // State
  const [users, setUsers] = useState<
    ResultOf<typeof getUsersNotInCourse>["data"]
  >([]);
  const [usersIds, setUsersIds] = useState<string[]>([]);

  const [searchText, setSearchText] = useState("");
  const [usersCount, setUsersCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmiotting] = useState(false);

  const [isSelectedAll, setIsSelectedAll] = useState(false);

  // Refs
  const usersOffsetRef = useRef(0);

  // Hooks
  const t = useTranslations();
  const fetchLock = useFetchLock();

  // Vars
  const isData = !!users.length && !isLoading;
  const isNoData =
    !isLoading && !isSearching && !usersCount && !searchText.length;

  const isNotFound =
    !isLoading && !isSearching && !users.length && !!searchText.length;

  // Handlers
  const selectAllUsers = () => {
    setUsersIds(users.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllUsers = () => {
    setUsersIds([]);
    setIsSelectedAll(false);
  };
  const fetchInitialUsers = async () => {
    setIsLoading(true);

    try {
      const { data, count } = await getUsersNotInCourse(courseId);

      setUsers(data);
      setUsersCount(count);

      usersOffsetRef.current = data.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsersBySearch = async (search: string) => {
    setIsSearching(true);

    try {
      const { data, count } = await getUsersNotInCourse(courseId, search);

      setUsers(data);
      setUsersCount(count);

      usersOffsetRef.current = data.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchMoreUsers = async () => {
    try {
      const from = usersOffsetRef.current;
      const to = usersOffsetRef.current + USERS_GET_LIMIT - 1;

      const { data } = await getUsersNotInCourse(
        courseId,
        searchText,
        from,
        to
      );

      setUsers((prev) => [...prev, ...data]);

      if (isSelectedAll) {
        setUsersIds((prev) => [...prev, ...data.map(({ id }) => id)]);
      }

      usersOffsetRef.current += data.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitEnrollUsers = async () => {
    setIsSubmiotting(true);
    try {
      await (isSelectedAll
        ? enrollAllUsersInCourses([courseId])
        : enrollUsersInCourses(usersIds, [courseId]));

      onClose(usersIds);

      toast.success(t("success.users_enrolled"));
      DB.functions.invoke("check-events");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmiotting(false);
    }
  };

  const onUserToggle = (checked: boolean, userId: string) => {
    if (checked) {
      setUsersIds((prev) => [...prev, userId]);
      setIsSelectedAll(usersCount === usersIds.length + 1);
    } else {
      setUsersIds((prev) => prev.filter((_id) => _id !== userId));
      setIsSelectedAll(usersCount === usersIds.length - 1);
    }
  };

  const throttledSearch = useCallback(
    throttleSearch((search) => {
      if (search) {
        fetchUsersBySearch(search);
      } else {
        fetchInitialUsers();
      }
    }, THROTTLE_SEARCH_WAIT),
    []
  );

  // Effects
  useEffect(() => throttledSearch(searchText), [searchText]);

  useEffect(() => {
    if (usersCount) setIsSelectedAll(usersCount === usersIds.length);
  }, [usersCount]);

  // View
  return (
    <BasicModal
      onClose={() => onClose([])}
      title={t("modal.titles.enrollment")}
    >
      <p className="mb-3 text-neutral-500">
        {t("common.select_users_to_enroll")}
      </p>
      {usersIds.length ? (
        <div className="mb-3 flex gap-3">
          <button
            onClick={isSelectedAll ? deselectAllUsers : selectAllUsers}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAll ? usersCount : usersIds.length}{" "}
            {isSelectedAll ? t("buttons.deselect") : t("buttons.select_all")}{" "}
            <CheckIcon size="xs" />
          </button>
        </div>
      ) : (
        <BasicInput
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          StartIcon={<SearchIcon />}
          autoFocus
          placeholder={t("placeholders.search")}
        />
      )}
      {isLoading && <LoadingSkeleton className="h-[222px]" />}

      {isData && (
        <Table
          className="mb-2"
          onScrollEnd={throttleFetch(fetchLock("courses", fetchMoreUsers))}
          compact
          data={users.map(({ id, avatar, name, role }) => ({
            Name: (
              <TitleCard
                href={`/users/${id}`}
                checked={usersIds.includes(id)}
                Icon={<Avatar avatar={avatar} />}
                title={name}
                subtitle={t(`roles.${role}`)}
                onClick={() => {}}
                onToggle={(checked) => onUserToggle(checked, id)}
              />
            ),
            "": "",
          }))}
        />
      )}
      {(isNoData || isNotFound) && (
        <NotFound action={null} variant="secondary" />
      )}

      <div className="flex justify-end gap-3 mt-auto">
        <button className="outline-button" onClick={() => onClose([])}>
          {t("buttons.cancel")}
        </button>
        <button
          disabled={!usersIds.length}
          className="primary-button"
          onClick={submitEnrollUsers}
        >
          {isSubmitting && <LoadingSpinner />}
          <span className={`${clsx(isSubmitting && "opacity-0")}`}>
            {t("buttons.enroll")}
          </span>
        </button>
      </div>
    </BasicModal>
  );
};

export default EnrollUsersInCourseModal;
