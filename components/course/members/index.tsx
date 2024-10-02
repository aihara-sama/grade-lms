"use client";

import { revalidatePageAction } from "@/actions/revalidate-page-action";
import Avatar from "@/components/avatar";
import CardTitle from "@/components/card-title";
import EnrollUsersInCourseModal from "@/components/common/modals/enroll-users-in-course-modal";
import PromptDeleteRecordModal from "@/components/common/modals/prompt-delete-record-modal";
import PromptDeleteRecordsModal from "@/components/common/modals/prompt-delete-records-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import Container from "@/components/container";
import CourseHeader from "@/components/course/course-header";
import IconTitle from "@/components/icon-title";
import AddCourseIcon from "@/components/icons/add-course-icon";
import AvatarIcon from "@/components/icons/avatar-icon";
import CheckIcon from "@/components/icons/check-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import NoData from "@/components/no-data";
import NotFound from "@/components/not-found";
import Skeleton from "@/components/skeleton";
import Table from "@/components/table";
import Total from "@/components/total";
import { MEMBERS_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import metadata from "@/data/metadata.json";
import {
  deleteAllUsersFromCourse,
  deleteUsersFromCourse,
  getCourseUsers,
} from "@/db/client/user";
import type { getCourse } from "@/db/server/course";
import { Role } from "@/enums/role.enum";
import useFetchLock from "@/hooks/use-fetch-lock";
import { useUpdateEffect } from "@/hooks/use-update-effect";
import { useUser } from "@/hooks/use-user";
import type { ResultOf } from "@/types/utils.type";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import { throttleSearch } from "@/utils/throttle/throttle-search";
import throttle from "lodash.throttle";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import type { FunctionComponent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";

interface Props {
  course: ResultOf<typeof getCourse>;
  users: ResultOf<typeof getCourseUsers>;
}

const Members: FunctionComponent<Props> = ({ course, users }) => {
  // Hooks
  const t = useTranslations();
  const user = useUser((state) => state.user);
  const { courseId } = useParams<{ courseId: string }>();

  const fetchLock = useFetchLock();

  // State
  const [isEnrollUsersModal, setIsEnrollUsersModal] = useState(false);
  const [isExpelMemberModal, setIsExpelMemberModal] = useState(false);
  const [isExpelMembersModal, setIsExpelMembersModal] = useState(false);

  const [members, setMembers] = useState(users.data);
  const [membersCount, setMembersCount] = useState(users.count);

  const [memberId, setMemberId] = useState<string>();
  const [membersIds, setMembersIds] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [isSelectedAll, setIsSelectedAll] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const membersOffsetRef = useRef(users.data.length);

  // Vars
  const isData = !!members.length && !isLoading;
  const isNoData =
    !isLoading && !isSearching && !membersCount && !searchText.length;

  const isNotFound =
    !isLoading && !isSearching && !members.length && !!searchText.length;

  // Handlers
  const selectAllMembers = () => {
    setMembersIds(members.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllMembers = () => {
    setMembersIds([]);
    setIsSelectedAll(false);
  };

  const fetchInitialMembers = async () => {
    setIsLoading(true);

    try {
      const { data, count } = await getCourseUsers(course.id);

      setMembers(data);
      setMembersCount(count);

      membersOffsetRef.current = data.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMembersBySearch = async (search: string) => {
    setIsSearching(true);

    try {
      const { data, count } = await getCourseUsers(course.id, search);

      setMembers(data);
      setMembersCount(count);

      setIsSelectedAll(false);
      setMembersIds([]);

      membersOffsetRef.current = data.length;
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

      const { data } = await getCourseUsers(courseId, searchText, from, to);

      setMembers((prev) => [...prev, ...data]);

      if (isSelectedAll) {
        setMembersIds((prev) => [...prev, ...data.map(({ id }) => id)]);
      }

      membersOffsetRef.current += data.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitExpelMember = async () => {
    try {
      await deleteUsersFromCourse(courseId, [memberId]);

      setMembers((prev) => prev.filter(({ id }) => id !== memberId));
      setMembersCount((prev) => prev - 1);

      setMembersIds((_) => _.filter((id) => id !== memberId));

      setIsExpelMemberModal(false);

      membersOffsetRef.current -= 1;

      toast.success(t("success.member_expelled"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const submitExpelMembers = async () => {
    try {
      if (isSelectedAll) {
        await deleteAllUsersFromCourse(courseId, searchText);
        setMembers([]);
        setMembersCount(0);
      } else {
        await deleteUsersFromCourse(courseId, membersIds);
        setMembers((prev) => prev.filter(({ id }) => !membersIds.includes(id)));
        setMembersCount((prev) => prev - membersIds.length);
      }

      setMembersIds([]);
      setIsExpelMembersModal(false);

      membersOffsetRef.current -= membersIds.length;

      toast.success(t("success.members_expelled"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onMemberToggle = (checked: boolean, _memberId: string) => {
    if (checked) {
      setMembersIds((prev) => [...prev, _memberId]);
      setIsSelectedAll(membersCount === membersIds.length + 1);
    } else {
      setMembersIds((prev) => prev.filter((_id) => _id !== _memberId));
      setIsSelectedAll(membersCount === membersIds.length - 1);
    }
  };

  const onUsersEnrolled = () => {
    revalidatePageAction();
    fetchMembersBySearch(searchText);
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

  // Effects
  useUpdateEffect(() => throttledSearch(searchText), [searchText]);

  useEffect(() => {
    if (membersCount) setIsSelectedAll(membersCount === membersIds.length);
  }, [membersCount]);

  useEffect(() => {
    // Tall screens may fit more than 20 records
    // This will fit the screen with records
    const fn = throttle(() => {
      if (Members.length && membersCount !== Members.length) {
        if (
          containerRef.current.scrollHeight ===
          containerRef.current.clientHeight
        ) {
          fetchLock("members", fetchMoreMembers)();
        }
      }
    }, 300);
    fn();

    window.addEventListener("resize", fn);

    return () => {
      window.removeEventListener("resize", fn);
    };
  }, [Members, membersCount]);

  // View
  return (
    <Container
      ref={containerRef}
      onScrollEnd={throttleFetch(fetchLock("courses", fetchMoreMembers))}
    >
      <CourseHeader course={course} />
      <p className="section-title">Members</p>
      <div className="mb-6">
        <div className="flex flex-wrap gap-6">
          <Total
            Icon={<AvatarIcon size="lg" />}
            total={membersCount}
            title="Total members"
          />
          {user.role === Role.Teacher && (
            <div className="card">
              <AddCourseIcon />
              <hr className="w-full my-3" />
              <button
                className="primary-button px-8"
                onClick={() => setIsEnrollUsersModal(true)}
              >
                Create
              </button>
            </div>
          )}
        </div>
      </div>
      {membersIds.length ? (
        <div className="mb-3 gap-2 flex">
          <button
            onClick={isSelectedAll ? deselectAllMembers : selectAllMembers}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAll ? membersCount : membersIds.length}{" "}
            {isSelectedAll ? `Deselect` : "Select all"} <CheckIcon size="xs" />
          </button>
          <button
            onClick={() => setIsExpelMembersModal(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Expel <DeleteIcon />
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
          data={members.map(({ name, role, id, avatar }, idx) => ({
            Name:
              user.id === id ? (
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
                  checked={membersIds.includes(id)}
                  Icon={<Avatar avatar={avatar} />}
                  title={name}
                  subtitle={role}
                  onClick={() => {}}
                  onToggle={
                    user.role === Role.Teacher
                      ? (checked) => onMemberToggle(checked, id)
                      : undefined
                  }
                />
              ),
            "": user.role === Role.Teacher && role !== Role.Teacher && (
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
                    onClick={() => setMemberId(id)}
                  >
                    <DotsIcon />
                  </button>
                }
              >
                <ul className="flex flex-col">
                  <li
                    className="popper-list-item"
                    onClick={() => setIsExpelMemberModal(true)}
                  >
                    <DeleteIcon /> Expel
                  </li>
                </ul>
              </BasePopper>
            ),
          }))}
        />
      )}
      {isNoData && (
        <NoData
          body={metadata.courses}
          action={
            <button
              className="primary-button"
              onClick={() => setIsEnrollUsersModal(true)}
            >
              Enroll users
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

      {isEnrollUsersModal && (
        <EnrollUsersInCourseModal
          onClose={onUsersEnrolled}
          courseId={courseId}
        />
      )}

      {isExpelMemberModal && (
        <PromptDeleteRecordModal
          title={t("modal.titles.expel_member")}
          confirmText={t("actions.expel")}
          onConfirm={submitExpelMember}
          prompt={`${t("prompts.expel_member")}`}
          record={members.find(({ id }) => id === memberId).name}
          onClose={() => setIsExpelMemberModal(false)}
        />
      )}

      {isExpelMembersModal && (
        <PromptDeleteRecordsModal
          title={t("modal.titles.expel_members")}
          prompt={`${t("prompts.expel_members", {
            count: membersIds.length,
          })}`}
          confirmText={t("actions.expel")}
          onConfirm={submitExpelMembers}
          onClose={() => setIsExpelMembersModal(false)}
        />
      )}
    </Container>
  );
};

export default Members;
