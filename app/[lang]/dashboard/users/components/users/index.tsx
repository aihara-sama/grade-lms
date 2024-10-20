"use client";

import TitleCard from "@/components/common/cards/title-card";
import Table from "@/components/common/table";
import Total from "@/components/common/total";
import AvatarIcon from "@/components/icons/avatar-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import SearchIcon from "@/components/icons/search-icon";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { revalidatePageAction } from "@/actions/revalidate-page-action";
import Avatar from "@/components/common/avatar";
import BasicInput from "@/components/common/inputs/basic-input";
import CreateUserModal from "@/components/common/modals/create-user-modal";
import EditUserModal from "@/components/common/modals/edit-user-modal";
import EnrollUsersInCoursesModal from "@/components/common/modals/enroll-users-in-courses-modal";
import PromptDeleteRecordModal from "@/components/common/modals/prompt-delete-record-modal";
import PromptDeleteRecordsModal from "@/components/common/modals/prompt-delete-records-modal";
import UpgradeToProModal from "@/components/common/modals/upgrade-to-pro-modal";
import NoData from "@/components/common/no-data";
import NotFound from "@/components/common/not-found";
import BasicPopper from "@/components/common/poppers/basic-popper";
import AddUserIcon from "@/components/icons/add-user-icon";
import CheckIcon from "@/components/icons/check-icon";
import DotsIcon from "@/components/icons/dots-icon";
import UsersIcon from "@/components/icons/users-icon";
import Container from "@/components/layout/container";
import LoadingSkeleton from "@/components/utilities/skeletons/loading-skeleton";
import { THROTTLE_SEARCH_WAIT, USERS_GET_LIMIT } from "@/constants";
import type { createUser } from "@/db/client/user";
import {
  deleteAllUsers,
  deleteUser,
  deleteUsers,
  getMyUsers,
  getMyUsersCount,
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
  users: ResultOf<typeof getMyUsers>;
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

  const [isUpgradeToProModal, setIsUpgradeToProModal] = useState(false);

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

  const isNotFound = !isLoading && !users.length && !!searchText.length;

  // Handlers
  const openCreateCourseModal = async () => {
    const { count } = await getMyUsersCount(user.id);

    if (user.is_pro || count < 3) setIsCreateUserModal(true);
    else if (count === 3) setIsUpgradeToProModal(true);
  };

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
      const { data, count } = await getMyUsers(user.id);

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
      const { data, count } = await getMyUsers(search);

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

      const { data } = await getMyUsers(user.id, searchText, from, to);

      setUsers(data);

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

      revalidatePageAction();
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

      revalidatePageAction();
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

  const onCreateUserModalClose = (maybeUser: ResultOf<typeof createUser>) => {
    setIsCreateUserModal(false);

    if (maybeUser) {
      if (maybeUser.name.includes(searchText)) {
        setUsers((prev) => [...prev, maybeUser]);
        setUsersCount((prev) => prev + 1);

        usersOffsetRef.current += 1;
      }
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
  const onEditUserModalClose = (updatedUser?: (typeof users)[number]) => {
    setIsEditUserModal(false);

    if (updatedUser) {
      setUsers((prev) => {
        return prev
          .map(({ id, ...rest }) => {
            if (id === updatedUser.id) return updatedUser;

            return { id, ...rest };
          })
          .filter(({ name }) => name.includes(searchText));
      });
    }
  };

  const onSubscribed = () => {
    setIsUpgradeToProModal(false);
    setIsCreateUserModal(true);
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
      <p className="text-3xl font-bold text-neutral-600">{t("users.title")}</p>
      <p className="text-neutral-500">{t("users.sub_title")}</p>
      <hr className="my-2 mb-4" />
      <div className="mb-6">
        <div className="flex flex-wrap gap-6">
          <Total
            Icon={<AvatarIcon size="lg" />}
            total={usersCount}
            title={t("cards.titles.total_users")}
          />
          <div className="card">
            <AddUserIcon size="lg" />
            <hr className="w-full my-3" />
            <button
              className="primary-button px-8"
              onClick={openCreateCourseModal}
            >
              {t("buttons.create")}
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
            {isSelectedAll ? t("buttons.deselect") : t("buttons.select_all")}{" "}
            <CheckIcon size="xs" />
          </button>
          <button
            onClick={() => setIsEnrollUsersInCoursesModal(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {t("buttons.enroll")} <CoursesIcon />
          </button>
          <button
            onClick={() => setIsDeleteUsersModal(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {t("buttons.delete")} <DeleteIcon size="xs" />
          </button>
        </div>
      ) : (
        <BasicInput
          StartIcon={<SearchIcon size="xs" />}
          placeholder={t("placeholders.search")}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-auto"
          value={searchText}
        />
      )}
      {isLoading && <LoadingSkeleton />}
      {isData && (
        <Table
          data={users.map(
            ({ name, id, avatar, email, user_settings: { role } }, idx) => ({
              [t("tables.users.name")]: (
                <TitleCard
                  checked={usersIds.includes(id)}
                  Icon={<Avatar avatar={avatar} />}
                  title={name}
                  subtitle={t(`roles.${role}`)}
                  onToggle={(checked) => onUserToggle(checked, id)}
                />
              ),
              [t("tables.users.email")]: email,
              "": (
                <BasicPopper
                  placement={
                    users.length > 7 && users.length - idx < 4
                      ? "top"
                      : "bottom"
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
                      <AvatarIcon size="xs" /> {t("buttons.edit")}
                    </li>
                    <li
                      className="popper-list-item"
                      onClick={() => setIsEnrollUserInCoursesModal(true)}
                    >
                      <UsersIcon /> {t("buttons.enroll")}
                    </li>
                    <li
                      onClick={() => setIsDeleteUserModal(true)}
                      className="popper-list-item"
                    >
                      <DeleteIcon size="xs" /> {t("buttons.delete")}
                    </li>
                  </ul>
                </BasicPopper>
              ),
            })
          )}
        />
      )}
      {isNoData && (
        <NoData
          body={t("users.description")}
          action={
            <button
              className="primary-button"
              disabled={user.role !== "teacher"}
              onClick={() => setIsCreateUserModal(true)}
            >
              {t("buttons.create_user")}
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
              {t("buttons.clear_filters")}
            </button>
          }
        />
      )}

      {isCreateUserModal && (
        <CreateUserModal onClose={onCreateUserModalClose} />
      )}

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
          confirmText={t("buttons.delete")}
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
          confirmText={t("buttons.delete")}
          onClose={() => setIsDeleteUsersModal(false)}
          onConfirm={submitDeleteUsers}
        />
      )}

      {isUpgradeToProModal && (
        <UpgradeToProModal
          onClose={() => setIsUpgradeToProModal(false)}
          onSubscribed={onSubscribed}
        />
      )}
    </Container>
  );
};
export default Users;
