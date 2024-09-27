"use client";

import Avatar from "@/components/avatar";
import CardTitle from "@/components/card-title";
import CardsContainer from "@/components/cards-container";
import PromptModal from "@/components/common/modals/prompt-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import Container from "@/components/container";
import CourseHeader from "@/components/course/course-header";
import IconTitle from "@/components/icon-title";
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
import EnrollUsers from "@/components/users/enroll-users";
import { MEMBERS_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import {
  deleteAllUsersFromCourse,
  deleteUsersFromCourse,
  getCourseUsers,
  getCourseUsersCount,
} from "@/db/client/user";
import type { getCourse } from "@/db/server/course";
import { Role } from "@/enums/role.enum";
import useFetchLock from "@/hooks/use-fetch-lock";
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
}

const Members: FunctionComponent<Props> = ({ course }) => {
  // Hooks
  const t = useTranslations();
  const user = useUser((state) => state.user);
  const { courseId } = useParams<{ courseId: string }>();

  const fetchLock = useFetchLock();

  // State
  const [isDispelMemberModal, setIsDispelMemberModal] = useState(false);
  const [isDispelMembersModal, setIsDispelMembersModal] = useState(false);

  const [members, setMembers] = useState<ResultOf<typeof getCourseUsers>>([]);
  const [membersCount, setMembersCount] = useState(0);

  const [memberId, setMemberId] = useState<string>();
  const [membersIds, setMembersIds] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [isSubmitDispelMember, setIsSubmitDispelMember] = useState(false);
  const [isSubmitDispelMembers, setIsSubmitDispelMembers] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [isSelectedAll, setIsSelectedAll] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const membersOffsetRef = useRef(0);

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
      const [fetchedMembers, fetchedMembersCount] = await Promise.all([
        getCourseUsers(courseId),
        getCourseUsersCount(courseId),
      ]);

      setMembers(fetchedMembers);
      setMembersCount(fetchedMembersCount);

      membersOffsetRef.current = fetchedMembers.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMembersBySearch = async (search: string) => {
    setIsSearching(true);

    try {
      const [fetchedMembers, fetchedUsersMembers] = await Promise.all([
        getCourseUsers(courseId, search),
        getCourseUsersCount(courseId, search),
      ]);

      setMembers(fetchedMembers);
      setMembersCount(fetchedUsersMembers);

      setIsSelectedAll(false);
      setMembersIds([]);

      membersOffsetRef.current = fetchedMembers.length;
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

      const fetchedMembers = await getCourseUsers(
        courseId,
        searchText,
        from,
        to
      );

      setMembers((prev) => [...prev, ...fetchedMembers]);

      if (isSelectedAll) {
        setMembersIds((prev) => [
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
    setIsSubmitDispelMember(true);

    try {
      await deleteUsersFromCourse(courseId, [memberId]);

      setMembers((prev) => prev.filter(({ id }) => id !== memberId));
      setMembersCount((prev) => prev - 1);

      setMembersIds((_) => _.filter((id) => id !== memberId));

      setIsDispelMemberModal(false);

      toast.success(t("student_dispelled"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitDispelMember(false);
    }
  };
  const submitDispelCourseMembers = async () => {
    setIsSubmitDispelMembers(true);

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
      setIsDispelMembersModal(false);

      toast.success(t("users_dispelled"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitDispelMembers(false);
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

  const onDispelMembersModalClose = () => {
    setIsDispelMembersModal(false);
  };

  const onDispelMemberModalClose = () => {
    setIsDispelMemberModal(false);
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
  useEffect(() => throttledSearch(searchText), [searchText]);

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
      <CardsContainer>
        <Total
          Icon={<AvatarIcon size="lg" />}
          total={membersCount}
          title="Total members"
        />
        {user.role === Role.Teacher && (
          <EnrollUsers
            onUsersEnrolled={() => fetchMembersBySearch(searchText)}
            courseId={courseId}
          />
        )}
      </CardsContainer>
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
            onClick={() => setIsDispelMembersModal(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Dispel <DeleteIcon />
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
                    onClick={() => setIsDispelMemberModal(true)}
                  >
                    <DeleteIcon /> Dispel
                  </li>
                </ul>
              </BasePopper>
            ),
          }))}
        />
      )}
      {isNoData && <NoData />}
      {isNotFound && <NotFound />}

      {isDispelMembersModal && (
        <PromptModal
          isSubmitting={isSubmitDispelMembers}
          onClose={onDispelMembersModalClose}
          title="Dispel Members"
          action="Dispel"
          actionHandler={submitDispelCourseMembers}
          body={t("prompts.dispel_users")}
        />
      )}
      {isDispelMemberModal && (
        <PromptModal
          isSubmitting={isSubmitDispelMember}
          onClose={onDispelMemberModalClose}
          title="Dispel member"
          action="Dispel"
          body={t("prompts.dispel_user")}
          actionHandler={submitDispelMember}
        />
      )}
    </Container>
  );
};

export default Members;
