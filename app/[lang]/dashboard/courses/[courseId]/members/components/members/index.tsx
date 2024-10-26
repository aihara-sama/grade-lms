"use client";

import { revalidatePageAction } from "@/actions/revalidate-page-action";
import Header from "@/app/[lang]/dashboard/courses/[courseId]/components/header";
import Avatar from "@/components/common/avatar";
import TitleCard from "@/components/common/cards/title-card";
import IconTitle from "@/components/common/icon-title";
import BasicInput from "@/components/common/inputs/basic-input";
import EnrollUsersInCourseModal from "@/components/common/modals/enroll-users-in-course-modal";
import PromptDeleteRecordModal from "@/components/common/modals/prompt-delete-record-modal";
import PromptDeleteRecordsModal from "@/components/common/modals/prompt-delete-records-modal";
import NoData from "@/components/common/no-data";
import NotFound from "@/components/common/not-found";
import BasicPopper from "@/components/common/poppers/basic-popper";
import Table from "@/components/common/table";
import Total from "@/components/common/total";
import AddCourseIcon from "@/components/icons/add-course-icon";
import AvatarIcon from "@/components/icons/avatar-icon";
import CheckIcon from "@/components/icons/check-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import SearchIcon from "@/components/icons/search-icon";
import Container from "@/components/layout/container";
import LoadingSkeleton from "@/components/utilities/skeletons/loading-skeleton";
import { MEMBERS_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import {
  deleteAllUsersFromCourse,
  deleteUsersFromCourse,
  getMembers,
} from "@/db/client/user";
import type { getCourse } from "@/db/server/course";
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
  users: ResultOf<typeof getMembers>;
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

  const isNotFound = !isLoading && !members.length && !!searchText.length;

  // Handlers
  const selectAllMembers = () => {
    setMembersIds(
      members.filter(({ id }) => id !== user.id).map(({ id }) => id)
    );
    setIsSelectedAll(true);
  };
  const deselectAllMembers = () => {
    setMembersIds([]);
    setIsSelectedAll(false);
  };

  const fetchInitialMembers = async () => {
    setIsLoading(true);

    try {
      const { data, count } = await getMembers(course.id);

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
      const { data, count } = await getMembers(course.id, search);

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

      const { data } = await getMembers(courseId, searchText, from, to);

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

      revalidatePageAction();

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
        setMembers((prev) => prev.filter(({ id }) => id === user.id));
        setMembersCount(1);
      } else {
        await deleteUsersFromCourse(courseId, membersIds);
        setMembers((prev) => prev.filter(({ id }) => !membersIds.includes(id)));
        setMembersCount((prev) => prev - membersIds.length);
      }

      setMembersIds([]);
      setIsExpelMembersModal(false);

      revalidatePageAction();

      membersOffsetRef.current -= membersIds.length;

      toast.success(t("success.members_expelled"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onMemberToggle = (checked: boolean, _memberId: string) => {
    if (checked) {
      setMembersIds((prev) => [...prev, _memberId]);
      setIsSelectedAll(membersCount - 1 === membersIds.length + 1);
    } else {
      setMembersIds((prev) => prev.filter((_id) => _id !== _memberId));
      setIsSelectedAll(membersCount - 1 === membersIds.length - 1);
    }
  };

  const onUsersEnrolled = (usersIds: string[]) => {
    setIsEnrollUsersModal(false);

    if (usersIds.length) {
      revalidatePageAction();
      fetchMembersBySearch(searchText);
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

  // Effects
  useUpdateEffect(() => throttledSearch(searchText), [searchText]);

  useEffect(() => {
    if (membersCount - 1)
      setIsSelectedAll(membersCount - 1 === membersIds.length);
  }, [membersCount]);

  useEffect(() => {
    // Tall screens may fit more than 20 records
    // This will fit the screen with records
    const fn = throttle(() => {
      if (members.length && membersCount !== members.length) {
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
  }, [members, membersCount]);

  // View
  return (
    <Container
      ref={containerRef}
      onScrollEnd={throttleFetch(fetchLock("courses", fetchMoreMembers))}
    >
      <Header course={course} />
      <p className="section-title">{t("members.title")}</p>
      <div className="mb-6">
        <div className="flex flex-wrap gap-6">
          <Total
            Icon={<AvatarIcon size="lg" />}
            total={membersCount}
            title={t("cards.titles.total_members")}
          />
          {user.role === "teacher" && (
            <div className="card">
              <AddCourseIcon />
              <hr className="w-full my-3" />
              <button
                className="primary-button px-8"
                onClick={() => setIsEnrollUsersModal(true)}
              >
                {t("buttons.enroll")}
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
            {isSelectedAll ? membersCount - 1 : membersIds.length}{" "}
            {isSelectedAll ? t("buttons.deselect") : t("buttons.select_all")}{" "}
            <CheckIcon size="xs" />
          </button>
          <button
            onClick={() => setIsExpelMembersModal(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {t("buttons.expel")} <DeleteIcon size="xs" />
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
          className="no-scrollbar"
          data={members.map(
            ({ name, id, avatar, user_settings: { role } }) => ({
              [t("tables.members.name")]:
                user.id === id && user.role === "teacher" ? (
                  <IconTitle
                    Icon={<Avatar avatar={avatar} />}
                    key={id}
                    title={name}
                    subtitle={t(`roles.${role}`)}
                  />
                ) : (
                  <TitleCard
                    checked={membersIds.includes(id)}
                    Icon={<Avatar avatar={avatar} />}
                    title={name}
                    subtitle={t(`roles.${role}`)}
                    onToggle={
                      user.role === "teacher"
                        ? (checked) => onMemberToggle(checked, id)
                        : undefined
                    }
                  />
                ),
              "": user.role === "teacher" && role !== "teacher" && (
                <BasicPopper
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
                      <DeleteIcon size="xs" /> {t("buttons.expel")}
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
          body={t("lessons.description")}
          action={
            <button
              className="primary-button"
              disabled={user.role !== "teacher"}
              onClick={() => setIsEnrollUsersModal(true)}
            >
              {t("buttons.enroll_users")}
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

      {isEnrollUsersModal && (
        <EnrollUsersInCourseModal
          onClose={onUsersEnrolled}
          courseId={courseId}
        />
      )}

      {isExpelMemberModal && (
        <PromptDeleteRecordModal
          title={t("modal.titles.expel_member")}
          confirmText={t("buttons.expel")}
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
          confirmText={t("buttons.expel")}
          onConfirm={submitExpelMembers}
          onClose={() => setIsExpelMembersModal(false)}
        />
      )}
    </Container>
  );
};

export default Members;
