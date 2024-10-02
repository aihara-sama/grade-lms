"use client";

import CardTitle from "@/components/card-title";
import AvatarIcon from "@/components/icons/avatar-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Table from "@/components/table";
import Total from "@/components/total";
import metadata from "@/data/metadata.json";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { revalidatePageAction } from "@/actions/revalidate-page-action";
import Avatar from "@/components/avatar";
import CreateUserModal from "@/components/common/modals/create-user-modal";
import EditUserModal from "@/components/common/modals/edit-user-modal";
import EnrollUsersInCoursesModal from "@/components/common/modals/enroll-users-in-courses-modal";
import PromptDeleteRecordModal from "@/components/common/modals/prompt-delete-record-modal";
import PromptDeleteRecordsModal from "@/components/common/modals/prompt-delete-records-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import Container from "@/components/container";
import AddUserIcon from "@/components/icons/add-user-icon";
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
} from "@/db/client/user";
import useFetchLock from "@/hooks/use-fetch-lock";
import { useUpdateEffect } from "@/hooks/use-update-effect";
import { useUser } from "@/hooks/use-user";
import type { ResultOf } from "@/types/utils.type";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import { throttleSearch } from "@/utils/throttle/throttle-search";
import throttle from "lodash.throttle";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

interface Props {
  users: ResultOf<typeof getUsers>;
}

const Users: FunctionComponent<Props> = ({ users: initUsers }) => {
  // Hooks
  const t = useTranslations();
  const user = useUser((state) => state.user);

  const fetchLock = useFetchLock();

  // State
  const [isCreateUserModal, setIsCreateUserModal] = useState(false);
  const [isEditUserModal, setIsEditUserModal] = useState(false);
  const [isDeleteUserModal, setIsDeleteUserModal] = useState(false);
  const [isDeleteUsersModal, setIsDeleteUsersModal] = useState(false);
  const [isEnrollUserInCoursesModal, setIsEnrollUserInCoursesModal] =
    useState(false);
  const [isEnrollUsersInCoursesModal, setIsEnrollUsersInCoursesModal] =
    useState(false);

  const [users, setUsers] = useState(initUsers.data);
  const [usersCount, setUsersCount] = useState(initUsers.count);

  const [userId, setUserId] = useState<string>();
  const [usersIds, setUsersIds] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

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
      const { data, count } = await getUsers();

      // Dont show current user
      setUsers(data.filter(({ id }) => id !== user.id));
      setUsersCount(Math.max(count - 1, 0));

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
      const { data, count } = await getUsers(search);

      // Dont show current user
      setUsers(data.filter(({ id }) => id !== user.id));
      setUsersCount(Math.max(count - 1, 0));

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

      const { data } = await getUsers(searchText, from, to);

      // Dont show current user
      setUsers((prev) => [...prev, ...data.filter(({ id }) => id !== user.id)]);

      usersOffsetRef.current += data.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitDeleteUser = async () => {
    try {
      await deleteUser(userId);

      setUsers((prev) => prev.filter(({ id }) => id !== userId));
      setUsersIds((_) => _.filter((id) => id !== userId));
      setUsersCount((prev) => prev - 1);

      setIsDeleteUserModal(false);

      toast.success(t("success.user_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const submitDeleteUsers = async () => {
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

      toast.success(t("success.users_deleted"));
    } catch (error: any) {
      toast.error(error.message);
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

  const onUserCreated = () => {
    setIsCreateUserModal(false);
    revalidatePageAction();
    fetchUsersBySearch(searchText);
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
  const onEditUserModalClose = (updatedUser?: (typeof users)[number]) => {
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
  useUpdateEffect(() => throttledSearch(searchText), [searchText]);

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
      <div className="mb-6">
        <div className="flex flex-wrap gap-6">
          <Total
            Icon={<AvatarIcon size="lg" />}
            total={usersCount}
            title="Total users"
          />
          <div className="card">
            <AddUserIcon size="lg" />
            <hr className="w-full my-3" />
            <button
              className="primary-button px-8"
              onClick={() => setIsCreateUserModal(true)}
            >
              Create
            </button>
          </div>
        </div>
      </div>

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
      {isNoData && (
        <NoData
          body={metadata.users}
          action={
            <button
              className="primary-button"
              onClick={() => setIsCreateUserModal(true)}
            >
              Create user
            </button>
          }
        />
      )}
      {isNotFound && (
        <NotFound
          action={
            <button
              className="outline-button"
              onClick={() => setSearchText("")}
            >
              Clear filters
            </button>
          }
        />
      )}

      {isCreateUserModal && <CreateUserModal onClose={onUserCreated} />}

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
        <PromptDeleteRecordModal
          title={t("modal.titles.delete_user")}
          confirmText={t("actions.delete")}
          onConfirm={submitDeleteUser}
          prompt={`${t("prompts.delete_user")}`}
          record={users.find(({ id }) => id === userId).name}
          onClose={() => setIsDeleteUserModal(false)}
        />
      )}
      {isDeleteUsersModal && (
        <PromptDeleteRecordsModal
          title={t("modal.titles.delete_user")}
          prompt={`${t("prompts.delete_users", {
            count: usersIds.length,
          })}`}
          confirmText={t("actions.delete")}
          onClose={() => setIsDeleteUsersModal(false)}
          onConfirm={submitDeleteUsers}
        />
      )}
    </Container>
  );
};
export default Users;
