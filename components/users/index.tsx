"use client";

import CardTitle from "@/components/card-title";
import CardsContainer from "@/components/cards-container";
import AvatarIcon from "@/components/icons/avatar-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Table from "@/components/table";
import Total from "@/components/total";
import CreateUser from "@/components/users/create-user";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import Avatar from "@/components/avatar";
import EditUserModal from "@/components/common/modals/edit-user-modal";
import EnrollUsersInCoursesModal from "@/components/common/modals/enroll-users-in-courses-modal";
import PromptModal from "@/components/common/modals/prompt-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import CheckIcon from "@/components/icons/check-icon";
import DotsIcon from "@/components/icons/dots-icon";
import NoDataIcon from "@/components/icons/no-data-icon";
import NotFoundIcon from "@/components/icons/not-found-icon";
import UsersIcon from "@/components/icons/users-icon";
import Skeleton from "@/components/skeleton";
import { USERS_GET_LIMIT } from "@/constants";
import {
  deleteAllUsers,
  deleteUserById,
  deleteUsersByIds,
  getUsersByCeratorId,
  getUsersByCreatorIdCount,
} from "@/db/user";
import { useUser } from "@/hooks/use-user";
import type { User } from "@/types/users";
import { isCloseToBottom } from "@/utils/is-document-close-to-bottom";
import { throttleFetch } from "@/utils/throttle-fetch";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

const Users: FunctionComponent = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [isDeleteUsersModalOpen, setIsDeleteUsersModalOpen] = useState(false);
  const [selectedUsersIds, setSelectedUsersIds] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>();

  const [isLoading, setIsLoading] = useState(true);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isEnrollUsersInCoursesModalOpen, setIsEnrollUsersInCoursesModalOpen] =
    useState(false);
  const [isEnrollUserInCoursesModalOpen, setIsEnrollUserInCoursesModalOpen] =
    useState(false);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [isSubmittingDeleteUser, setIsSubmittingDeleteUser] = useState(false);
  const [isSubmittingDeleteUsers, setIsSubmittingDeleteUsers] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isEditUserModal, setIsEditUserModal] = useState(false);

  // Refs
  const usersOffsetRef = useRef(0);

  // Hooks
  const t = useTranslations();
  const { user } = useUser();

  // Vars
  const isData = !!users.length && !isLoading;
  const isNoData =
    !isLoading && !isSearching && !totalUsersCount && !searchText.length;

  const isNotFound =
    !isLoading && !isSearching && !users.length && !!searchText.length;

  // Handlers
  const selectAllUsers = () => {
    setSelectedUsersIds(users.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllUsers = () => {
    setSelectedUsersIds([]);
    setIsSelectedAll(false);
  };

  const fetchInitialUsers = async () => {
    setIsLoading(true);

    try {
      const [fetchedUsers, fetchedUsersCount] = await Promise.all([
        getUsersByCeratorId(user.id),
        getUsersByCreatorIdCount(user.id),
      ]);

      setUsers(fetchedUsers);
      setTotalUsersCount(fetchedUsersCount);

      usersOffsetRef.current = fetchedUsers.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchUsersBySearch = async (refetch?: boolean) => {
    setIsSearching(true);

    try {
      const [fetchedUsers, fetchedUsersCount] = await Promise.all([
        getUsersByCeratorId(user.id, searchText),
        getUsersByCreatorIdCount(user.id, searchText),
      ]);

      setUsers(fetchedUsers);
      setTotalUsersCount(fetchedUsersCount);

      setIsSelectedAll(false);
      setSelectedUsersIds([]);

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

      const fetchedUsers = await getUsersByCeratorId(
        user.id,
        searchText,
        from,
        to
      );

      setUsers((prev) => [...prev, ...fetchedUsers]);

      if (isSelectedAll) {
        setSelectedUsersIds((prev) => [
          ...prev,
          ...fetchedUsers.map(({ id }) => id),
        ]);
      }

      usersOffsetRef.current += fetchedUsers.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitDeleteUser = async () => {
    setIsSubmittingDeleteUser(true);

    try {
      await deleteUserById(selectedUserId);

      setIsDeleteUserModalOpen(false);
      setSelectedUsersIds((_) => _.filter((id) => id !== selectedUserId));
      fetchUsersBySearch(true);

      toast.success(t("user_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDeleteUser(false);
    }
  };
  const submitDeleteUsers = async () => {
    setIsSubmittingDeleteUsers(true);

    try {
      await (isSelectedAll
        ? deleteAllUsers(user.id, searchText)
        : deleteUsersByIds(selectedUsersIds));

      setSelectedUsersIds([]);
      setIsDeleteUsersModalOpen(false);
      fetchUsersBySearch(true);

      toast.success(t("users_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDeleteUsers(false);
    }
  };

  const onUserToggle = (checked: boolean, userId: string) => {
    if (checked) {
      setSelectedUsersIds((prev) => [...prev, userId]);
      setIsSelectedAll(totalUsersCount === selectedUsersIds.length + 1);
    } else {
      setSelectedUsersIds((prev) => prev.filter((_id) => _id !== userId));
      setIsSelectedAll(totalUsersCount === selectedUsersIds.length - 1);
    }
  };

  const onCoursesScroll = (e: Event) => {
    if (isCloseToBottom(e.target as HTMLElement)) {
      fetchMoreUsers();
    }
  };
  const onEnrollUsersInCoursesModalClose = (mutated?: boolean) => {
    setIsEnrollUsersInCoursesModalOpen(false);

    if (mutated) {
      setSelectedUsersIds([]);
    }
  };
  const onEditUserModalClose = (mutated?: boolean) => {
    setIsEditUserModal(false);

    if (mutated) {
      fetchInitialUsers();
    }
  };

  // Effects
  useEffect(() => {
    const throttled = throttleFetch(onCoursesScroll);
    document
      .getElementById("content-wrapper")
      .addEventListener("scroll", throttled);

    return () => {
      document
        .getElementById("content-wrapper")
        .removeEventListener("scroll", throttled);
    };
  }, [isSelectedAll, searchText]);
  useEffect(() => {
    if (searchText) {
      fetchUsersBySearch();
    } else {
      fetchInitialUsers();
    }
  }, [searchText]);
  useEffect(() => {
    setIsSelectedAll(totalUsersCount === selectedUsersIds.length);
  }, [totalUsersCount]);

  useEffect(() => {
    // Tall screens may fit more than 20 records. This will fit the screen
    if (users.length && totalUsersCount !== users.length) {
      const contentWrapper = document.getElementById("content-wrapper");
      if (contentWrapper.scrollHeight === contentWrapper.clientHeight) {
        fetchMoreUsers();
      }
    }
  }, [users, totalUsersCount]);
  return (
    <>
      <CardsContainer>
        <Total
          Icon={<AvatarIcon size="lg" />}
          total={totalUsersCount}
          title="Total users"
        />
        <CreateUser onUserCreated={() => fetchUsersBySearch(true)} />
      </CardsContainer>
      {selectedUsersIds.length ? (
        <div className="mb-3 gap-2 flex">
          <button
            onClick={isSelectedAll ? deselectAllUsers : selectAllUsers}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAll ? totalUsersCount : selectedUsersIds.length}{" "}
            {isSelectedAll ? `Deselect` : "Select all"} <CheckIcon size="xs" />
          </button>
          <button
            onClick={() => setIsEnrollUsersInCoursesModalOpen(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Enroll <CoursesIcon />
          </button>
          <button
            onClick={() => setIsDeleteUsersModalOpen(true)}
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
          data={users.map(({ name, role, id, avatar, email }, idx) => ({
            Name: (
              <CardTitle
                href={`/users/${id}`}
                checked={selectedUsersIds.includes(id)}
                Icon={<Avatar avatar={avatar} />}
                title={name}
                subtitle={role}
                onToggle={(checked) => onUserToggle(checked, id)}
              />
            ),
            Email: email,
            "": (
              <BasePopper
                placement={
                  users.length > 7 && users.length - idx < 4 ? "top" : "bottom"
                }
                width="sm"
                trigger={
                  <button
                    className="icon-button text-neutral-500"
                    onClick={() => setSelectedUserId(id)}
                  >
                    <DotsIcon />
                  </button>
                }
              >
                <ul className="flex flex-col">
                  <li
                    className="popper-list-item"
                    onClick={() => setIsEditUserModal(true)}
                  >
                    <AvatarIcon size="xs" /> Edit
                  </li>
                  <li
                    className="popper-list-item"
                    onClick={() => setIsEnrollUserInCoursesModalOpen(true)}
                  >
                    <UsersIcon /> Enroll
                  </li>
                  <li
                    onClick={() => setIsDeleteUserModalOpen(true)}
                    className="popper-list-item"
                  >
                    <DeleteIcon /> Delete
                  </li>
                </ul>
              </BasePopper>
            ),
          }))}
        />
      )}
      {isNoData && (
        <div className="flex justify-center mt-12">
          <div className="flex flex-col items-center">
            <NoDataIcon />
            <p className="mt-4 font-bold">View your work in a list</p>
          </div>
        </div>
      )}
      {isNotFound && (
        <div className="flex justify-center mt-12">
          <div className="flex flex-col items-center">
            <NotFoundIcon />
            <p className="mt-4 font-bold">
              It looks like we can&apos;t find any results for that match
            </p>
          </div>
        </div>
      )}
      {isEnrollUserInCoursesModalOpen && (
        <EnrollUsersInCoursesModal
          usersIds={[selectedUserId]}
          onClose={() => setIsEnrollUserInCoursesModalOpen(false)}
        />
      )}
      {isEnrollUsersInCoursesModalOpen && (
        <EnrollUsersInCoursesModal
          usersIds={selectedUsersIds}
          onClose={onEnrollUsersInCoursesModalClose}
        />
      )}
      {isEditUserModal && (
        <EditUserModal userId={selectedUserId} onClose={onEditUserModalClose} />
      )}

      {isDeleteUserModalOpen && (
        <PromptModal
          isSubmitting={isSubmittingDeleteUser}
          onClose={() => setIsDeleteUsersModalOpen(false)}
          title="Delete user"
          action="Delete"
          body="Are you sure you want to delete this user?"
          actionHandler={submitDeleteUser}
        />
      )}
      {isDeleteUsersModalOpen && (
        <PromptModal
          isSubmitting={isSubmittingDeleteUsers}
          onClose={() => setIsDeleteUsersModalOpen(false)}
          title="Delete Users"
          action="Delete"
          actionHandler={submitDeleteUsers}
          body={t("prompts.delete_users")}
        />
      )}
    </>
  );
};
export default Users;
