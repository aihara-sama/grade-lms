import Avatar from "@/components/avatar";
import CardTitle from "@/components/card-title";
import BaseModal from "@/components/common/modals/base-modal";
import Table from "@/components/table";
import type { FunctionComponent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import CheckIcon from "@/components/icons/check-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import { USERS_GET_LIMIT } from "@/constants";
import {
  enrollAllUsers,
  enrollUsersInCourses,
  getUsersNotInCourse,
  getUsersNotInCourseCount,
} from "@/db/user";
import type { User } from "@/types/users";
import { db } from "@/utils/supabase/client";
import { throttleFetch } from "@/utils/throttle-fetch";
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
  const [selectedUsersIds, setSelectedUsersIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmiotting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [totalUsersCount, setTotalUsersCount] = useState(0);

  // Refs
  const usersOffsetRef = useRef(0);

  // Hooks
  const t = useTranslations();

  // Handlers
  const selectAllUsers = () => {
    setSelectedUsersIds(users.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllUsers = () => {
    setSelectedUsersIds([]);
    setIsSelectedAll(false);
  };
  const fetchUsers = async (merge: boolean = true) => {
    try {
      const [fetchedUsers, fetchedUsersCount] = await Promise.all([
        getUsersNotInCourse(
          courseId,
          searchText,
          merge ? usersOffsetRef.current : 0,
          usersOffsetRef.current + USERS_GET_LIMIT - 1
        ),
        getUsersNotInCourseCount(courseId, searchText),
      ]);

      setUsers((prev) => {
        return [...(merge ? prev : []), ...fetchedUsers];
      });
      setTotalUsersCount(fetchedUsersCount);
      if (isSelectedAll) {
        setSelectedUsersIds((prev) => [
          ...prev,
          ...fetchedUsers.map(({ id }) => id),
        ]);
      }
      usersOffsetRef.current =
        fetchedUsers.length + (merge ? usersOffsetRef.current : 0);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitEnrollUsers = async () => {
    setIsSubmiotting(true);
    try {
      await (isSelectedAll
        ? enrollAllUsers(courseId)
        : enrollUsersInCourses(selectedUsersIds, [courseId]));
      onClose(true);
      toast(t("users_enrolled"));
      db.functions.invoke("check-events");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmiotting(false);
    }
  };

  const onUserToggle = (checked: boolean, userId: string) => {
    if (checked) {
      setSelectedUsersIds((prev) => [...prev, userId]);
    } else {
      setSelectedUsersIds((prev) => prev.filter((_id) => _id !== userId));
    }
  };
  const onScrollEnd = useCallback(throttleFetch(fetchUsers), [
    searchText,
    isSelectedAll,
  ]);

  // Effects
  useEffect(() => {
    fetchUsers(false);
  }, [searchText]);

  // View
  return (
    <BaseModal onClose={() => onClose()} title="Enrollment">
      <p className="mb-3 text-neutral-500">Select users to enroll</p>
      <div className="">
        {selectedUsersIds.length ? (
          <div className="mb-3 flex gap-3">
            <button
              onClick={isSelectedAll ? deselectAllUsers : selectAllUsers}
              className="outline-button flex font-semibold gap-2 items-center"
            >
              {isSelectedAll ? totalUsersCount : selectedUsersIds.length}{" "}
              {isSelectedAll ? `Deselect` : "Select all"}{" "}
              <CheckIcon size="xs" />
            </button>
          </div>
        ) : (
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            Icon={<SearchIcon />}
            autoFocus
            placeholder="Search..."
          />
        )}

        <Table
          onScrollEnd={onScrollEnd}
          compact
          data={users.map(({ id, avatar, name, role }) => ({
            Name: (
              <CardTitle
                href={`/users/${id}`}
                checked={selectedUsersIds.includes(id)}
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
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button className="outline-button" onClick={() => onClose()}>
          Cancel
        </button>
        <button
          disabled={!selectedUsersIds.length}
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
