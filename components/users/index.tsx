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
import UserOptionsPopper from "@/components/common/poppers/user-options-popper";
import CheckIcon from "@/components/icons/check-icon";
import Skeleton from "@/components/skeleton";
import { USERS_GET_LIMIT } from "@/constants";
import {
  deleteUsersByCreatorId,
  getOffsetUsersByNameAndCreatorId,
  getUsersByCreatorId,
  getUsersByNameAndCreatorId,
  getUsersCountByCreatorId,
  getUsersCountByTitleAndUserId,
} from "@/db/user";
import type { User } from "@/types/users";
import { isDocCloseToBottom } from "@/utils/is-document-close-to-bottom";
import type { User as AuthUser } from "@supabase/supabase-js";
import throttle from "lodash.throttle";
import { useTranslations } from "next-intl";
import type { ChangeEvent, FunctionComponent } from "react";

interface IProps {
  currentUser: AuthUser;
}

const Users: FunctionComponent<IProps> = ({ currentUser }) => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [isDeleteUsersModalOpen, setIsDeleteUsersModalOpen] = useState(false);
  const [selectedUsersIds, setSelectedUsersIds] = useState<string[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [usersSearchText, setUsersSearchText] = useState("");
  const [isEnrollUsersInCoursesModalOpen, setIsEnrollUsersInCoursesModalOpen] =
    useState(false);

  // Refs
  const isSelectedAllRef = useRef(false);
  const usersSearchTextRef = useRef("");
  const usersOffsetRef = useRef(USERS_GET_LIMIT);

  // Hooks
  const t = useTranslations();

  // Handlers
  const fetchUsersWithCount = async () => {
    setIsUsersLoading(true);

    try {
      const [usersByCreatorId, usersCountByCreatorIdId] = await Promise.all([
        getUsersByCreatorId(currentUser.id),
        getUsersCountByCreatorId(currentUser.id),
      ]);
      setUsers(usersByCreatorId);
      setTotalUsersCount(usersCountByCreatorIdId);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUsersLoading(false);
    }
  };
  const handleDeleteUsers = async () => {
    try {
      await deleteUsersByCreatorId(currentUser.id, selectedUsersIds);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSelectedUsersIds([]);
      setIsDeleteUsersModalOpen(false);

      fetchUsersWithCount();
    }
  };

  const fetchUsersBySearch = async () => {
    try {
      const [usersByTitleAndUserId, usersCountByTitleAndUserId] =
        await Promise.all([
          getUsersByNameAndCreatorId(
            usersSearchTextRef.current,
            currentUser.id
          ),
          getUsersCountByTitleAndUserId(
            usersSearchTextRef.current,
            currentUser.id
          ),
        ]);

      setUsers(usersByTitleAndUserId);
      setTotalUsersCount(usersCountByTitleAndUserId);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const selectAllUsers = () => {
    setSelectedUsersIds(users.map(({ id }) => id));
    isSelectedAllRef.current = true;
  };
  const deselectAllUsers = () => {
    setSelectedUsersIds([]);
    isSelectedAllRef.current = false;
  };
  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsersSearchText((usersSearchTextRef.current = e.target.value));
    fetchUsersBySearch();
  };
  const onUserToggle = (checked: boolean, userId: string) => {
    if (checked) {
      setSelectedUsersIds((prev) => [...prev, userId]);
      isSelectedAllRef.current =
        totalUsersCount === selectedUsersIds.length + 1;
    } else {
      setSelectedUsersIds((prev) => prev.filter((_id) => _id !== userId));
      isSelectedAllRef.current =
        totalUsersCount === selectedUsersIds.length - 1;
    }
  };
  const handleCoursesScroll = async () => {
    if (isDocCloseToBottom()) {
      try {
        const offsetUsersByUserId = await getOffsetUsersByNameAndCreatorId(
          usersSearchTextRef.current,
          currentUser.id,
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

  // Effects
  useEffect(() => {
    const throttled = throttle(handleCoursesScroll, 300);
    document.addEventListener("scroll", throttled);

    return () => {
      document.removeEventListener("scroll", throttled);
    };
  }, []);
  useEffect(() => {
    fetchUsersWithCount();
  }, []);
  useEffect(() => {
    usersSearchTextRef.current = usersSearchText;
  }, [usersSearchText]);

  return (
    <>
      <CardsContainer>
        <Total
          Icon={<AvatarIcon size="lg" />}
          total={totalUsersCount}
          title="Total users"
        />
        <CreateUser onDone={fetchUsersWithCount} />
      </CardsContainer>
      {selectedUsersIds.length ? (
        <div className="mb-3 gap-2 flex">
          <button
            onClick={
              isSelectedAllRef.current ? deselectAllUsers : selectAllUsers
            }
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAllRef.current
              ? totalUsersCount
              : selectedUsersIds.length}{" "}
            {isSelectedAllRef.current ? `Deselect` : "Select all"}{" "}
            <CheckIcon size="xs" />
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
            data={users.map(({ name, role, id, avatar }) => ({
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
              "": (
                <UserOptionsPopper
                  onDone={fetchUsersBySearch}
                  setSelectedUsersIds={setSelectedUsersIds}
                  userId={id}
                  currentUser={currentUser}
                />
              ),
            }))}
          />
        </div>
      )}

      <PromptModal
        isOpen={isDeleteUsersModalOpen}
        setIsOpen={setIsDeleteUsersModalOpen}
        title="Delete Users"
        action="Delete"
        actionHandler={handleDeleteUsers}
        body="Are you sure you want to delete selected users?"
      />
      <EnrollUsersInCoursesModal
        onDone={() => setSelectedUsersIds([])}
        currentUser={currentUser}
        usersIds={selectedUsersIds}
        isOpen={isEnrollUsersInCoursesModalOpen}
        setIsOpen={setIsEnrollUsersInCoursesModalOpen}
      />
    </>
  );
};

export default Users;
