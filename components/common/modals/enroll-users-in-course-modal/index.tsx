import Avatar from "@/components/avatar";
import CardTitle from "@/components/card-title";
import BaseModal from "@/components/common/modals/base-modal";
import Table from "@/components/table";
import type { FunctionComponent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import CheckIcon from "@/components/icons/check-icon";
import NoDataIcon from "@/components/icons/no-data-icon";
import NotFoundIcon from "@/components/icons/not-found-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Skeleton from "@/components/skeleton";
import { THROTTLE_SEARCH_WAIT, USERS_GET_LIMIT } from "@/constants";
import {
  enrollAllUsers,
  enrollUsersInCourses,
  getUsersNotInCourse,
  getUsersNotInCourseCount,
} from "@/db/user";
import type { User } from "@/types/users";
import { db } from "@/utils/supabase/client";
import { throttleFetch } from "@/utils/throttle-fetch";
import { throttleSearch } from "@/utils/throttle-search";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface Props {
  onClose: (mutated?: boolean) => void;
  courseId: string;
}

const EnrollUsersInCourseModal: FunctionComponent<Props> = ({
  courseId,
  onClose,
}) => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [usersIds, setUsersIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmiotting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [usersCount, setUsersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Refs
  const usersOffsetRef = useRef(0);

  // Hooks
  const t = useTranslations();

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
      const [fetchedUsers, fetchedUsersCount] = await Promise.all([
        getUsersNotInCourse(courseId),
        getUsersNotInCourseCount(courseId),
      ]);

      setUsers(fetchedUsers);
      setUsersCount(fetchedUsersCount);

      if (isSelectedAll) {
        setUsersIds((prev) => [...prev, ...fetchedUsers.map(({ id }) => id)]);
      }
      usersOffsetRef.current = fetchedUsers.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsersBySearch = async (search: string, refetch?: boolean) => {
    setIsSearching(true);

    try {
      const [fetchedUsers, fetchedUsersCount] = await Promise.all([
        getUsersNotInCourse(courseId, search),
        getUsersNotInCourseCount(courseId, search),
      ]);

      setUsers(fetchedUsers);
      setUsersCount(fetchedUsersCount);

      setIsSelectedAll(false);
      setUsersIds([]);

      usersOffsetRef.current += refetch ? fetchedUsers.length : 0;
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

      const fetchedUsers = await getUsersNotInCourse(
        courseId,
        searchText,
        from,
        to
      );

      setUsers((prev) => [...prev, ...fetchedUsers]);

      if (isSelectedAll) {
        setUsersIds((prev) => [...prev, ...fetchedUsers.map(({ id }) => id)]);
      }

      usersOffsetRef.current += fetchedUsers.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitEnrollUsers = async () => {
    setIsSubmiotting(true);
    try {
      await (isSelectedAll
        ? enrollAllUsers(courseId)
        : enrollUsersInCourses(usersIds, [courseId]));
      onClose(true);
      toast(t("users_enrolled"));
      db.functions.invoke("check-events");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmiotting(false);
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

  const onUserToggle = (checked: boolean, userId: string) => {
    if (checked) {
      setUsersIds((prev) => [...prev, userId]);
      setIsSelectedAll(usersCount === usersIds.length + 1);
    } else {
      setUsersIds((prev) => prev.filter((_id) => _id !== userId));
      setIsSelectedAll(usersCount === usersIds.length - 1);
    }
  };
  const onScrollEnd = useCallback(throttleFetch(fetchMoreUsers), [
    searchText,
    isSelectedAll,
  ]);

  // Effects
  useEffect(() => throttledSearch(searchText), [searchText]);

  // View
  return (
    <BaseModal onClose={() => onClose()} title="Enrollment">
      <p className="mb-3 text-neutral-500">Select users to enroll</p>
      {usersIds.length ? (
        <div className="mb-3 flex gap-3">
          <button
            onClick={isSelectedAll ? deselectAllUsers : selectAllUsers}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAll ? usersCount : usersIds.length}{" "}
            {isSelectedAll ? `Deselect` : "Select all"} <CheckIcon size="xs" />
          </button>
        </div>
      ) : (
        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          startIcon={<SearchIcon />}
          autoFocus
          placeholder="Search..."
        />
      )}
      {isLoading && <Skeleton className="h-[282px]" />}

      {isData && (
        <Table
          onScrollEnd={onScrollEnd}
          compact
          data={users.map(({ id, avatar, name, role }) => ({
            Name: (
              <CardTitle
                href={`/users/${id}`}
                checked={usersIds.includes(id)}
                Icon={<Avatar avatar={avatar} />}
                title={name}
                subtitle={role}
                onClick={() => {}}
                onToggle={(checked) => onUserToggle(checked, id)}
              />
            ),
            "": "",
          }))}
        />
      )}
      {isNoData && (
        <div className="flex justify-center mt-12 h-[234px]">
          <div className="flex flex-col items-center">
            <NoDataIcon size="xl" />
            <p className="mt-4 font-bold">View your work in a list</p>
          </div>
        </div>
      )}
      {isNotFound && (
        <div className="flex justify-center mt-12 h-[234px]">
          <div className="flex flex-col items-center">
            <NotFoundIcon size="xl" />
            <p className="mt-4 font-bold text-center">
              It looks like we can&apos;t find any results for that match
            </p>
          </div>
        </div>
      )}
      <div className="flex justify-end gap-3 mt-auto">
        <button className="outline-button" onClick={() => onClose()}>
          Cancel
        </button>
        <button
          disabled={!usersIds.length}
          className="primary-button"
          onClick={submitEnrollUsers}
        >
          {isSubmitting && (
            <img
              className="loading-spinner"
              src="/gifs/loading-spinner.gif"
              alt=""
            />
          )}
          <span className={`${clsx(isSubmitting && "opacity-0")}`}>Enroll</span>
        </button>
      </div>
    </BaseModal>
  );
};

export default EnrollUsersInCourseModal;
