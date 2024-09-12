"use client";

import Avatar from "@/components/avatar";
import CardTitle from "@/components/card-title";
import CardsContainer from "@/components/cards-container";
import PromptModal from "@/components/common/modals/prompt-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import IconTitle from "@/components/icon-title";
import AvatarIcon from "@/components/icons/avatar-icon";
import CheckIcon from "@/components/icons/check-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import NoDataIcon from "@/components/icons/no-data-icon";
import NotFoundIcon from "@/components/icons/not-found-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Skeleton from "@/components/skeleton";
import Table from "@/components/table";
import Total from "@/components/total";
import EnrollUsers from "@/components/users/enroll-users";
import { MEMBERS_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import {
  dispelAllUsers,
  dispelUsers,
  getUsersByCourseId,
  getUsersByCourseIdCount,
} from "@/db/user";
import { Role } from "@/interfaces/user.interface";
import type { User } from "@/types/users";
import { isCloseToBottom } from "@/utils/is-document-close-to-bottom";
import { throttleFetch } from "@/utils/throttle-fetch";
import { throttleSearch } from "@/utils/throttle-search";
import type { User as AuthUser } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";

interface Props {
  courseId: string;
  currentUser: AuthUser;
}
const Members: FunctionComponent<Props> = ({ courseId, currentUser }) => {
  const [isDispelMembersModalOpen, setIsDispelMembersModalOpen] =
    useState(false);
  const [isDispelMemberModalOpen, setIsDispelMemberModalOpen] = useState(false);
  const [selectedMembersIds, setSelectedMembersIds] = useState<string[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>();
  const [members, setMembers] = useState<User[]>([]);
  const [totalMembersCount, setTotalMembersCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [isSubmittingDispelMember, setIsSubmittingDispelMember] =
    useState(false);
  const [isSubmittingDispelMembers, setIsSubmittingDispelMembers] =
    useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Refs
  const membersOffsetRef = useRef(0);

  // Hooks
  const t = useTranslations();

  // Vars
  const isData = !!members.length && !isLoading;
  const isNoData =
    !isLoading && !isSearching && !totalMembersCount && !searchText.length;

  const isNotFound =
    !isLoading && !isSearching && !members.length && !!searchText.length;

  // Handlers
  const selectAllMembers = () => {
    setSelectedMembersIds(members.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllMembers = () => {
    setSelectedMembersIds([]);
    setIsSelectedAll(false);
  };

  const fetchInitialMembers = async () => {
    setIsLoading(true);

    try {
      const [fetchedMembers, fetchedMembersCount] = await Promise.all([
        getUsersByCourseId(courseId),
        getUsersByCourseIdCount(courseId),
      ]);

      setMembers(fetchedMembers);
      setTotalMembersCount(fetchedMembersCount);

      membersOffsetRef.current = fetchedMembers.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMembersBySearch = async (search: string, refetch?: boolean) => {
    setIsSearching(true);

    try {
      const [fetchedMembers, fetchedUsersMembers] = await Promise.all([
        getUsersByCourseId(courseId, search),
        getUsersByCourseIdCount(courseId, search),
      ]);

      setMembers(fetchedMembers);
      setTotalMembersCount(fetchedUsersMembers);

      setIsSelectedAll(false);
      setSelectedMembersIds([]);

      membersOffsetRef.current += refetch ? fetchedMembers.length : 0;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSearching(false);
    }
  };
  const fetchMoreMembers = async () => {
    try {
      const from = membersOffsetRef.current;
      const to = membersOffsetRef.current + MEMBERS_GET_LIMIT - 1;

      const fetchedMembers = await getUsersByCourseId(
        courseId,
        searchText,
        from,
        to
      );

      setMembers((prev) => [...prev, ...fetchedMembers]);

      if (isSelectedAll) {
        setSelectedMembersIds((prev) => [
          ...prev,
          ...fetchedMembers.map(({ id }) => id),
        ]);
      }

      membersOffsetRef.current += fetchedMembers.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitDispelMember = async () => {
    setIsSubmittingDispelMember(true);

    try {
      await dispelUsers(courseId, [selectedMemberId]);

      setIsDispelMemberModalOpen(false);
      setSelectedMembersIds((_) => _.filter((id) => id !== selectedMemberId));
      fetchMembersBySearch(searchText, true);

      toast.success(t("student_dispelled"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDispelMember(false);
    }
  };
  const submitDispelCourseMembers = async () => {
    setIsSubmittingDispelMembers(true);

    try {
      await (isSelectedAll
        ? dispelAllUsers(courseId, searchText)
        : dispelUsers(courseId, selectedMembersIds));

      setSelectedMembersIds([]);
      setIsDispelMembersModalOpen(false);
      fetchMembersBySearch(searchText, true);

      toast.success(t("users_dispelled"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDispelMembers(false);
    }
  };

  const throttledSearch = useCallback(
    throttleSearch((search) => {
      if (search) {
        fetchMembersBySearch(search);
      } else {
        fetchInitialMembers();
      }
    }, THROTTLE_SEARCH_WAIT),
    []
  );

  const onMemberToggle = (checked: boolean, memberId: string) => {
    if (checked) {
      setSelectedMembersIds((prev) => [...prev, memberId]);
      setIsSelectedAll(totalMembersCount === selectedMembersIds.length + 1);
    } else {
      setSelectedMembersIds((prev) => prev.filter((_id) => _id !== memberId));
      setIsSelectedAll(totalMembersCount === selectedMembersIds.length - 1);
    }
  };

  const onCoursesScroll = async (e: Event) => {
    if (isCloseToBottom(e.target as HTMLElement)) {
      fetchMoreMembers();
    }
  };

  const onDispelMembersModalClose = () => {
    setIsDispelMembersModalOpen(false);
  };

  const onDispelMemberModalClose = () => {
    setIsDispelMemberModalOpen(false);
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
        ?.removeEventListener("scroll", throttled);
    };
  }, [isSelectedAll, searchText]);
  useEffect(() => throttledSearch(searchText), [searchText]);

  useEffect(() => {
    setIsSelectedAll(totalMembersCount === selectedMembersIds.length);
  }, [totalMembersCount]);

  useEffect(() => {
    // Tall screens may fit more than 20 records. This will fit the screen
    if (members.length && totalMembersCount !== members.length) {
      const contentWrapper = document.getElementById("content-wrapper");
      if (contentWrapper.scrollHeight === contentWrapper.clientHeight) {
        fetchMoreMembers();
      }
    }
  }, [members, totalMembersCount]);

  return (
    <>
      <p className="section-title">Members</p>
      <CardsContainer>
        <Total
          Icon={<AvatarIcon size="lg" />}
          total={totalMembersCount}
          title="Total members"
        />
        <EnrollUsers
          onUsersEnrolled={() => fetchMembersBySearch(searchText, true)}
          courseId={courseId}
        />
      </CardsContainer>
      {selectedMembersIds.length ? (
        <div className="mb-3 gap-2 flex">
          <button
            onClick={isSelectedAll ? deselectAllMembers : selectAllMembers}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAll ? totalMembersCount : selectedMembersIds.length}{" "}
            {isSelectedAll ? `Deselect` : "Select all"} <CheckIcon size="xs" />
          </button>
          <button
            onClick={() => setIsDispelMembersModalOpen(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Dispel <DeleteIcon />
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
          data={members.map(({ name, role, id, avatar }, idx) => ({
            Name:
              currentUser.id === id ? (
                <IconTitle
                  Icon={<Avatar avatar={avatar} />}
                  key={id}
                  title={name}
                  subtitle={role}
                  href={`/users/${id}`}
                />
              ) : (
                <CardTitle
                  href={`/users/${id}`}
                  checked={selectedMembersIds.includes(id)}
                  Icon={<Avatar avatar={avatar} />}
                  title={name}
                  subtitle={role}
                  onClick={() => {}}
                  onToggle={(checked) => onMemberToggle(checked, id)}
                />
              ),
            "": role !== Role.Teacher && (
              <BasePopper
                placement={
                  members.length > 7 && members.length - idx < 4
                    ? "top"
                    : "bottom"
                }
                width="sm"
                trigger={
                  <button
                    className="icon-button text-neutral-500"
                    onClick={() => setSelectedMemberId(id)}
                  >
                    <DotsIcon />
                  </button>
                }
              >
                <ul className="flex flex-col">
                  <li
                    className="popper-list-item"
                    onClick={() => setIsDispelMemberModalOpen(true)}
                  >
                    <DeleteIcon /> Dispel
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

      {isDispelMembersModalOpen && (
        <PromptModal
          isSubmitting={isSubmittingDispelMembers}
          onClose={onDispelMembersModalClose}
          title="Dispel Members"
          action="Dispel"
          actionHandler={submitDispelCourseMembers}
          body={t("prompts.dispel_users")}
        />
      )}
      {isDispelMemberModalOpen && (
        <PromptModal
          isSubmitting={isSubmittingDispelMember}
          onClose={onDispelMemberModalClose}
          title="Dispel member"
          action="Dispel"
          body={t("prompts.dispel_user")}
          actionHandler={submitDispelMember}
        />
      )}
    </>
  );
};

export default Members;
