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
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import Avatar from "@/components/avatar";
import EditUserModal from "@/components/common/modals/edit-user-modal";
import EnrollUsersInCoursesModal from "@/components/common/modals/enroll-users-in-courses-modal";
import PromptModal from "@/components/common/modals/prompt-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import Container from "@/components/container";
import CheckIcon from "@/components/icons/check-icon";
import DotsIcon from "@/components/icons/dots-icon";
import UsersIcon from "@/components/icons/users-icon";
import NoData from "@/components/no-data";
import NotFound from "@/components/not-found";
import Skeleton from "@/components/skeleton";
import { THROTTLE_SEARCH_WAIT, USERS_GET_LIMIT } from "@/constants";
import {
  deleteAllUsers,
  deleteUser,
  deleteUsers,
  getUsers,
  getUsersCount,
} from "@/db/client/user";
import useFetchLock from "@/hooks/use-fetch-lock";
import type { ResultOf } from "@/types/utils.type";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import { throttleSearch } from "@/utils/throttle/throttle-search";
import type { User } from "@supabase/supabase-js";
import throttle from "lodash.throttle";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

interface Props {
  user: User;
}

const Users: FunctionComponent<Props> = ({ user }) => {
  // Hooks
  const t = useTranslations();
  const fetchLock = useFetchLock();

  // State

  const [isEditUserModal, setIsEditUserModal] = useState(false);
  const [isDeleteUserModal, setIsDeleteUserModal] = useState(false);
  const [isDeleteUsersModal, setIsDeleteUsersModal] = useState(false);
  const [isEnrollUserInCoursesModal, setIsEnrollUserInCoursesModal] =
    useState(false);
  const [isEnrollUsersInCoursesModal, setIsEnrollUsersInCoursesModal] =
    useState(false);

  const [users, setUsers] = useState<ResultOf<typeof getUsers>>([]);
  const [usersCount, setUsersCount] = useState(0);

  const [userId, setUserId] = useState<string>();
  const [usersIds, setUsersIds] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [isSubmittingDeleteUser, setIsSubmittingDeleteUser] = useState(false);
  const [isSubmittingDeleteUsers, setIsSubmittingDeleteUsers] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [isSelectedAll, setIsSelectedAll] = useState(false);

  // Refs
  const usersOffsetRef = useRef(0);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

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
        getUsers(),
        getUsersCount(),
      ]);

      // Dont show current user
      setUsers(fetchedUsers.filter(({ id }) => id !== user.id));
      setUsersCount(Math.max(fetchedUsersCount - 1, 0));

      usersOffsetRef.current = fetchedUsers.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchUsersBySearch = async (search: string) => {
    setIsSearching(true);

    try {
      const [fetchedUsers, fetchedUsersCount] = await Promise.all([
        getUsers(search),
        getUsersCount(search),
      ]);

      // Dont show current user
      setUsers(fetchedUsers.filter(({ id }) => id !== user.id));
      setUsersCount(Math.max(fetchedUsersCount - 1, 0));

      usersOffsetRef.current = fetchedUsers.length;
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

      const fetchedUsers = await getUsers(searchText, from, to);

      // Dont show current user
      setUsers((prev) => [
        ...prev,
        ...fetchedUsers.filter(({ id }) => id !== user.id),
      ]);

      usersOffsetRef.current += fetchedUsers.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitDeleteUser = async () => {
    setIsSubmittingDeleteUser(true);

    try {
      await deleteUser(userId);

      setUsers((prev) => prev.filter(({ id }) => id !== userId));
      setUsersIds((_) => _.filter((id) => id !== userId));
      setUsersCount((prev) => prev - 1);

      setIsDeleteUserModal(false);

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
      if (isSelectedAll) {
        await deleteAllUsers(searchText);
        setUsers([]);
        setUsersCount(0);
      } else {
        await deleteUsers(usersIds);
        setUsers((prev) => prev.filter(({ id }) => !usersIds.includes(id)));
        setUsersCount((prev) => prev - usersIds.length);
      }

      setUsersIds([]);
      setIsDeleteUsersModal(false);

      toast.success(t("users_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDeleteUsers(false);
    }
  };

  const onUserToggle = (checked: boolean, _userId: string) => {
    if (checked) {
      setUsersIds((prev) => [...prev, _userId]);
      setIsSelectedAll(usersCount === usersIds.length + 1);
    } else {
      setUsersIds((prev) => prev.filter((_id) => _id !== _userId));
      setIsSelectedAll(usersCount === usersIds.length - 1);
    }
  };

  const onEnrollUserInCoursesModalClose = (mutated?: boolean) => {
    setIsEnrollUserInCoursesModal(false);

    if (mutated) {
      setUserId(undefined);
    }
  };
  const onEnrollUsersInCoursesModalClose = (mutated?: boolean) => {
    setIsEnrollUsersInCoursesModal(false);

    if (mutated) {
      setUsersIds([]);
    }
  };
  const onEditUserModalClose = (
    updatedUser?: ResultOf<typeof getUsers>[number]
  ) => {
    setIsEditUserModal(false);

    if (updatedUser) {
      setUsers((prev) => {
        return prev.map(({ id, ...rest }) => {
          if (id === updatedUser.id) return updatedUser;

          return { id, ...rest };
        });
      });
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
    // Tall screens may fit more than 20 records
    // This will fit the screen with records
    const fn = throttle(() => {
      if (users.length && usersCount !== users.length) {
        if (
          contentWrapperRef.current.scrollHeight ===
          contentWrapperRef.current.clientHeight
        ) {
          fetchLock("users", fetchMoreUsers)();
        }
      }
    }, 300);
    fn();

    window.addEventListener("resize", fn);

    return () => {
      window.removeEventListener("resize", fn);
    };
  }, [users, usersCount]);

  useEffect(() => {
    if (usersCount) setIsSelectedAll(usersCount === usersIds.length);
  }, [usersCount]);

  // View
  return (
    <Container
      ref={contentWrapperRef}
      onScrollEnd={throttleFetch(fetchLock("users", fetchMoreUsers))}
    >
      <p className="text-3xl font-bold text-neutral-600">Users</p>
      <p className="text-neutral-500">View and manage users</p>
      <hr className="my-2 mb-4" />
      <CardsContainer>
        <Total
          Icon={<AvatarIcon size="lg" />}
          total={usersCount}
          title="Total users"
        />
        <CreateUser onUserCreated={() => fetchUsersBySearch(searchText)} />
      </CardsContainer>
      {usersIds.length ? (
        <div className="mb-3 gap-2 flex">
          <button
            onClick={isSelectedAll ? deselectAllUsers : selectAllUsers}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAll ? usersCount : usersIds.length}{" "}
            {isSelectedAll ? `Deselect` : "Select all"} <CheckIcon size="xs" />
          </button>
          <button
            onClick={() => setIsEnrollUsersInCoursesModal(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Enroll <CoursesIcon />
          </button>
          <button
            onClick={() => setIsDeleteUsersModal(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Delete <DeleteIcon />
          </button>
        </div>
      ) : (
        <Input
          StartIcon={<SearchIcon size="xs" />}
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
                checked={usersIds.includes(id)}
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
                    onClick={() => setUserId(id)}
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
                    onClick={() => setIsEnrollUserInCoursesModal(true)}
                  >
                    <UsersIcon /> Enroll
                  </li>
                  <li
                    onClick={() => setIsDeleteUserModal(true)}
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
      {isNoData && <NoData />}
      {isNotFound && <NotFound />}

      {isEnrollUserInCoursesModal && (
        <EnrollUsersInCoursesModal
          usersIds={[userId]}
          onClose={onEnrollUserInCoursesModalClose}
        />
      )}
      {isEnrollUsersInCoursesModal && (
        <EnrollUsersInCoursesModal
          usersIds={usersIds}
          onClose={onEnrollUsersInCoursesModalClose}
          shouldEnrollAll={isSelectedAll}
        />
      )}
      {isEditUserModal && (
        <EditUserModal userId={userId} onClose={onEditUserModalClose} />
      )}

      {isDeleteUserModal && (
        <PromptModal
          isSubmitting={isSubmittingDeleteUser}
          onClose={() => setIsDeleteUsersModal(false)}
          title="Delete user"
          action="Delete"
          body="Are you sure you want to delete this user?"
          actionHandler={submitDeleteUser}
        />
      )}
      {isDeleteUsersModal && (
        <PromptModal
          isSubmitting={isSubmittingDeleteUsers}
          onClose={() => setIsDeleteUsersModal(false)}
          title="Delete Users"
          action="Delete"
          actionHandler={submitDeleteUsers}
          body={t("prompts.delete_users")}
        />
      )}
    </Container>
  );
};
export default Users;
