"use client";

import CardTitle from "@/components/card-title";
import CardsContainer from "@/components/cards-container";
import PromptModal from "@/components/common/modals/prompt-modal";
import MemberOptionsPopper from "@/components/common/poppers/member-options-popper";
import IconTitle from "@/components/icon-title";
import AvatarIcon from "@/components/icons/avatar-icon";
import CheckIcon from "@/components/icons/check-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Table from "@/components/table";
import Total from "@/components/total";
import EnrollUsers from "@/components/users/enroll-users";
import { USERS_GET_LIMIT } from "@/constants";
import {
  dispelAllStudentsByNameFromCourse,
  dispelUsersFromCourse,
  getOffsetUsersByNameAndCourseId,
  getUsersByCourseId,
  getUsersByNameAndCourseId,
  getUsersCountByCourseId,
  getUsersCountByTitleAndCourseId,
} from "@/db/user";
import type { User } from "@/types/users";
import { isDocCloseToBottom } from "@/utils/is-document-close-to-bottom";
import type { User as AuthUser } from "@supabase/supabase-js";
import throttle from "lodash.throttle";
import { useTranslations } from "next-intl";
import type { ChangeEvent, FunctionComponent } from "react";
import { useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";

interface IProps {
  courseId: string;
  currentUser: AuthUser;
}
const Members: FunctionComponent<IProps> = ({ courseId, currentUser }) => {
  const [isDispelMembersModalOpen, setIsDispelMembersModalOpen] =
    useState(false);
  const [selectedMembersIds, setSelectedMembersIds] = useState<string[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [membersSearchText, setMembersSearchText] = useState("");

  // Refs
  const isSelectedAllRef = useRef(false);
  const membersSearchTextRef = useRef("");
  const membersOffsetRef = useRef(USERS_GET_LIMIT);

  // Hooks
  const t = useTranslations();

  const fetchMembersWithCount = async () => {
    try {
      const [usersByCourseId, usersCountByCourseId] = await Promise.all([
        getUsersByCourseId(courseId),
        getUsersCountByCourseId(courseId),
      ]);

      setMembers(usersByCourseId);
      setTotalUsersCount(usersCountByCourseId);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchMembersBySearch = async () => {
    try {
      const [usersByTitleAndUserId, usersCountByTitleAndUserId] =
        await Promise.all([
          getUsersByNameAndCourseId(membersSearchTextRef.current, courseId),
          getUsersCountByTitleAndCourseId(
            membersSearchTextRef.current,
            courseId
          ),
        ]);

      setMembers(usersByTitleAndUserId);
      setTotalUsersCount(usersCountByTitleAndUserId);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const dispelMembers = async () => {
    try {
      await (isSelectedAllRef.current
        ? dispelAllStudentsByNameFromCourse(
            membersSearchTextRef.current,
            courseId
          )
        : dispelUsersFromCourse(selectedMembersIds, courseId));
      setSelectedMembersIds([]);
      setIsDispelMembersModalOpen(false);
      toast.success(t("users_dispelled"));
      fetchMembersBySearch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMembersSearchText((membersSearchTextRef.current = e.target.value));
    fetchMembersBySearch();
  };

  const selectAllMembers = () => {
    setSelectedMembersIds(members.map(({ id }) => id));
    isSelectedAllRef.current = true;
  };
  const deselectAllMembers = () => {
    setSelectedMembersIds([]);
    isSelectedAllRef.current = false;
  };
  const handleCoursesScroll = async () => {
    if (isDocCloseToBottom()) {
      try {
        const offsetMembersByCourseId = await getOffsetUsersByNameAndCourseId(
          membersSearchTextRef.current,
          courseId,
          membersOffsetRef.current,
          membersOffsetRef.current + USERS_GET_LIMIT - 1
        );

        setMembers((prev) => [...prev, ...offsetMembersByCourseId]);

        if (isSelectedAllRef.current) {
          setSelectedMembersIds((prev) => [
            ...prev,
            ...offsetMembersByCourseId.map(({ id }) => id),
          ]);
        }

        membersOffsetRef.current += offsetMembersByCourseId.length;
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    const throttled = throttle(handleCoursesScroll, 300);
    document.addEventListener("scroll", throttled);

    return () => {
      document.removeEventListener("scroll", throttled);
    };
  }, []);
  useEffect(() => {
    membersSearchTextRef.current = membersSearchText;
  }, [membersSearchText]);
  useEffect(() => {
    fetchMembersWithCount();
  }, []);

  return (
    <>
      <p className="section-title">Members</p>
      <CardsContainer>
        <Total
          Icon={<AvatarIcon size="lg" />}
          total={totalUsersCount}
          title="Total members"
        />
        <EnrollUsers
          onDone={fetchMembersWithCount}
          courseId={courseId}
          user={currentUser}
        />
      </CardsContainer>
      {selectedMembersIds.length ? (
        <div className="mb-3 gap-2 flex">
          <button
            onClick={
              isSelectedAllRef.current ? deselectAllMembers : selectAllMembers
            }
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAllRef.current
              ? totalUsersCount
              : selectedMembersIds.length}{" "}
            {isSelectedAllRef.current ? `Deselect` : "Select all"}{" "}
            <CheckIcon size="xs" />
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
          onChange={handleSearchInputChange}
          className="w-auto"
          value={membersSearchText}
        />
      )}
      <Table
        data={members.map(({ name, role, id, avatar }) => ({
          Name:
            currentUser.id === id ? (
              <IconTitle
                Icon={
                  <img
                    className="rounded-[50%] w-8 h-8"
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`}
                    alt=""
                  />
                }
                key={id}
                title={name}
                subtitle={role}
                href={`/users/${id}`}
              />
            ) : (
              <CardTitle
                href={`/users/${id}`}
                checked={selectedMembersIds.includes(id)}
                Icon={
                  <img
                    className="rounded-[50%] w-8 h-8"
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`}
                    alt=""
                  />
                }
                title={name}
                subtitle={role}
                onClick={() => {}}
                onToggle={(checked) =>
                  checked
                    ? setSelectedMembersIds((prev) => [...prev, id])
                    : setSelectedMembersIds((prev) =>
                        prev.filter((_id) => _id !== id)
                      )
                }
              />
            ),
          "": (
            <MemberOptionsPopper
              onDone={fetchMembersBySearch}
              setSelectedMembersIds={setSelectedMembersIds}
              courseId={courseId}
              memberId={id}
            />
          ),
        }))}
      />
      <PromptModal
        isOpen={isDispelMembersModalOpen}
        setIsOpen={setIsDispelMembersModalOpen}
        title="Dispel Members"
        action="Dispel"
        actionHandler={dispelMembers}
        body={t("prompts.dispel_users")}
      />
    </>
  );
};

export default Members;
