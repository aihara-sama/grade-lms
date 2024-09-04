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
import EnrollUsersInCoursesModal from "@/components/common/modals/enroll-users-in-courses";
import PromptModal from "@/components/common/modals/prompt-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import CheckIcon from "@/components/icons/check-icon";
import DotsIcon from "@/components/icons/dots-icon";
import UsersIcon from "@/components/icons/users-icon";
import Skeleton from "@/components/skeleton";
import { USERS_GET_LIMIT } from "@/constants";
import {
  deleteUsersByNameAndCreatorId,
  deleteUsersByUsersIds,
  getOffsetUsersByNameAndCreatorId,
  getUsersByCreatorId,
  getUsersByNameAndCreatorId,
  getUsersCountByCreatorId,
  getUsersCountByTitleAndUserId,
} from "@/db/user";
import { useUser } from "@/hooks/use-user";
import type { User } from "@/types/users";
import { isDocCloseToBottom } from "@/utils/is-document-close-to-bottom";
import throttle from "lodash.throttle";
import { useTranslations } from "next-intl";
import type { ChangeEvent, FunctionComponent } from "react";

const Users: FunctionComponent = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [isDeleteUsersModalOpen, setIsDeleteUsersModalOpen] = useState(false);
  const [selectedUsersIds, setSelectedUsersIds] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [usersSearchText, setUsersSearchText] = useState("");
  const [isEnrollUsersInCoursesModalOpen, setIsEnrollUsersInCoursesModalOpen] =
    useState(false);
  const [isEnrollUserInCoursesModalOpen, setIsEnrollUserInCoursesModalOpen] =
    useState(false);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [isSubmittingDeleteUser, setIsSubmittingDeleteUser] = useState(false);
  const [isSubmittingDeleteUsers, setIsSubmittingDeleteUsers] = useState(false);

  // Refs
  const isSelectedAllRef = useRef(false);
  const usersSearchTextRef = useRef("");
  const usersOffsetRef = useRef(USERS_GET_LIMIT);

  // Hooks
  const t = useTranslations();
  const { user } = useUser();

  // Handlers
  const fetchUsersWithCount = async () => {
    setIsUsersLoading(true);

    try {
      const [usersByCreatorId, usersCountByCreatorId] = await Promise.all([
        getUsersByCreatorId(user.id),
        getUsersCountByCreatorId(user.id),
      ]);
      setUsers(usersByCreatorId);
      setTotalUsersCount(usersCountByCreatorId);
      setIsSelectedAll(false);
      setSelectedUsersIds([]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUsersLoading(false);
    }
  };
  const fetchUsersBySearch = async () => {
    try {
      const [usersByTitleAndUserId, usersCountByTitleAndUserId] =
        await Promise.all([
          getUsersByNameAndCreatorId(usersSearchTextRef.current, user.id),
          getUsersCountByTitleAndUserId(usersSearchTextRef.current, user.id),
        ]);

      setUsers(usersByTitleAndUserId);
      setTotalUsersCount(usersCountByTitleAndUserId);
      setIsSelectedAll(false);
      setSelectedUsersIds([]);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const submitDeleteUsers = async () => {
    setIsSubmittingDeleteUsers(true);
    try {
      await (isSelectedAllRef.current
        ? deleteUsersByNameAndCreatorId(usersSearchTextRef.current, user.id)
        : deleteUsersByUsersIds(selectedUsersIds));
      setSelectedUsersIds([]);
      setIsDeleteUsersModalOpen(false);
      toast.success(t("users_deleted"));
      fetchUsersBySearch();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDeleteUsers(false);
    }
  };

  const submitDeleteUser = async () => {
    setIsSubmittingDeleteUser(true);
    try {
      await deleteUsersByUsersIds([selectedUserId]);
      setIsDeleteUserModalOpen(false);
      setSelectedUsersIds((_) => _.filter((id) => id !== selectedUserId));
      fetchUsersBySearch();
      toast.success(t("user_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDeleteUser(false);
    }
  };

  const selectAllUsers = () => {
    setSelectedUsersIds(users.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllUsers = () => {
    setSelectedUsersIds([]);
    setIsSelectedAll(false);
  };
  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsersSearchText((usersSearchTextRef.current = e.target.value));
    fetchUsersBySearch();
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
  const handleCoursesScroll = async () => {
    if (isDocCloseToBottom()) {
      try {
        const offsetUsersByUserId = await getOffsetUsersByNameAndCreatorId(
          usersSearchTextRef.current,
          user.id,
          usersOffsetRef.current,
          usersOffsetRef.current + USERS_GET_LIMIT - 1
        );

        setUsers((prev) => [...prev, ...offsetUsersByUserId]);

        if (isSelectedAllRef.current) {
          setSelectedUsersIds((prev) => [
            ...prev,
            ...offsetUsersByUserId.map(({ id }) => id),
          ]);
        }

        usersOffsetRef.current += offsetUsersByUserId.length;
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const onEnrollUsersInCoursesModalClose = (mutated?: boolean) => {
    setIsEnrollUsersInCoursesModalOpen(false);

    if (mutated) {
      setSelectedUsersIds([]);
    }
  };

  // Effects
  useEffect(() => {
    const throttled = throttle(handleCoursesScroll, 300);
    document
      .getElementById("content-wrapper")
      .addEventListener("scroll", throttled);

    return () => {
      document
        .getElementById("content-wrapper")
        .removeEventListener("scroll", throttled);
    };
  }, []);
  useEffect(() => {
    fetchUsersWithCount();
  }, []);
  useEffect(() => {
    usersSearchTextRef.current = usersSearchText;
  }, [usersSearchText]);
  useEffect(() => {
    isSelectedAllRef.current = isSelectedAll;
  }, [isSelectedAll]);
  useEffect(() => {
    setIsSelectedAll(totalUsersCount === selectedUsersIds.length);
  }, [totalUsersCount]);
  return (
    <>
      <CardsContainer>
        <Total
          Icon={<AvatarIcon size="lg" />}
          total={totalUsersCount}
          title="Total users"
        />
        <CreateUser onUserCreated={fetchUsersBySearch} />
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
          onChange={handleSearchInputChange}
          className="w-auto"
          value={usersSearchText}
        />
      )}
      {isUsersLoading ? (
        <Skeleton />
      ) : (
        <div className="flex-1 flex">
          <Table
            data={users.map(({ name, role, id, avatar, email }) => ({
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
                      onClick={() => setIsEnrollUsersInCoursesModalOpen(true)}
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
        </div>
      )}

      {isEnrollUsersInCoursesModalOpen && (
        <EnrollUsersInCoursesModal
          usersIds={selectedUsersIds}
          onClose={onEnrollUsersInCoursesModalClose}
        />
      )}
      {isEnrollUserInCoursesModalOpen && (
        <EnrollUsersInCoursesModal
          usersIds={[selectedUserId]}
          onClose={() => setIsEnrollUserInCoursesModalOpen(false)}
        />
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
