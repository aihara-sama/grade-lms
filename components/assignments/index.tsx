"use client";

import CreateAssignment from "@/components/assignments/create-assignment";
import CardsContainer from "@/components/cards-container";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Table from "@/components/table";
import Total from "@/components/total";

import CardTitle from "@/components/card-title";
import EditAssignmentModal from "@/components/common/modals/edit-assignment-modal";
import PromptModal from "@/components/common/modals/prompt-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import CheckIcon from "@/components/icons/check-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import NoData from "@/components/no-data";
import NotFound from "@/components/not-found";
import Skeleton from "@/components/skeleton";
import { THROTTLE_SEARCH_WAIT } from "@/constants";
import {
  deleteAllAssignmentsFromLesson,
  deleteAssignment,
  deleteAssignments,
  getLessonAssignments,
  getLessonAssignmentsCount,
} from "@/db/assignment";
import { Role } from "@/enums/role.enum";
import { useUser } from "@/hooks/use-user";
import type { Assignment } from "@/types/assignment.type";
import type { Lesson } from "@/types/lesson.type";
import { throttleSearch } from "@/utils/throttle/throttle-search";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  lesson: Lesson;
}
const Assignments: FunctionComponent<Props> = ({ lesson }) => {
  // States
  const [isDelAssignmentsModal, setIsDelAssignmentsModal] = useState(false);
  const [isEditAssignmentModal, setIsEditAssignmentModal] = useState(false);
  const [isDelAssignmentModal, setIsDelAssignmentModal] = useState(false);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentsCount, setAssignmentsCount] = useState(0);
  const [assignmentId, setAssignmentId] = useState<string>();
  const [assignmentsIds, setAssignmentsIds] = useState<string[]>([]);

  const [searchText, setSearchText] = useState("");

  const [isSelectedAll, setIsSelectedAll] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [isSubmittingDelAssign, setIsSubmittingDelAssign] = useState(false);
  const [isSubmittingDelAssigns, setIsSubmittingDelAssigns] = useState(false);

  // Refs
  const assignmentsOffsetRef = useRef(0);

  // Hooks
  const t = useTranslations();
  const { user } = useUser();

  // Vars
  const isData = !!assignments.length && !isLoading;
  const isNoData =
    !isLoading && !isSearching && !assignmentsCount && !searchText.length;

  const isNotFound =
    !isLoading && !isSearching && !assignments.length && !!searchText.length;

  // Handlers
  const selectAllAssignments = () => {
    setAssignmentsIds(assignments.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllAssignments = () => {
    setAssignmentsIds([]);
    setIsSelectedAll(false);
  };

  const fetchInitialAssignments = async () => {
    setIsLoading(true);

    try {
      const [fetchedAssignments, fetchedAssginemtnsCount] = await Promise.all([
        getLessonAssignments(lesson.id),
        getLessonAssignmentsCount(lesson.id),
      ]);

      setAssignments(fetchedAssignments);
      setAssignmentsCount(fetchedAssginemtnsCount);

      assignmentsOffsetRef.current = fetchedAssignments.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchAssignmentsBySearch = async (
    search: string,
    refetch?: boolean
  ) => {
    setIsSearching(true);

    try {
      const [fetchedAssignments, fetchedAssignmentsCount] = await Promise.all([
        getLessonAssignments(lesson.id, search),
        getLessonAssignmentsCount(lesson.id, search),
      ]);

      setAssignments(fetchedAssignments);
      setAssignmentsCount(fetchedAssignmentsCount);

      setIsSelectedAll(false);
      setAssignmentsIds([]);

      assignmentsOffsetRef.current += refetch ? fetchedAssignments.length : 0;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSearching(false);
    }
  };
  // const fetchMoreAssignments = async () => {
  //   try {
  //     const from = assignmentsOffsetRef.current;
  //     const to = assignmentsOffsetRef.current + ASSIGNMENTS_GET_LIMIT - 1;

  //     const fetchedAssignments = await getLessonAssignments(
  //       lesson.id,
  //       searchText,
  //       from,
  //       to
  //     );

  //     setAssignments((prev) => [...prev, ...fetchedAssignments]);

  //     if (isSelectedAll) {
  //       setAssignmentsIds((prev) => [
  //         ...prev,
  //         ...fetchedAssignments.map(({ id }) => id),
  //       ]);
  //     }

  //     assignmentsOffsetRef.current += fetchedAssignments.length;
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   }
  // };

  const submitDeleteAssignment = async () => {
    setIsSubmittingDelAssign(true);

    try {
      await deleteAssignment(assignmentId);

      setIsDelAssignmentModal(false);
      setAssignmentsIds((_) => _.filter((id) => id !== assignmentId));
      fetchAssignmentsBySearch(searchText, true);

      toast.success(t("assignment_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDelAssign(false);
    }
  };
  const submitDeleteAssignments = async () => {
    setIsSubmittingDelAssigns(true);

    try {
      await (isSelectedAll
        ? deleteAllAssignmentsFromLesson(lesson.id, searchText)
        : deleteAssignments(assignmentsIds));

      setAssignmentsIds([]);
      setIsDelAssignmentsModal(false);
      fetchAssignmentsBySearch(searchText, true);

      toast.success(t("assignments_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDelAssigns(false);
    }
  };

  const throttledSearch = useCallback(
    throttleSearch((search) => {
      if (search) {
        fetchAssignmentsBySearch(search);
      } else {
        fetchInitialAssignments();
      }
    }, THROTTLE_SEARCH_WAIT),
    []
  );

  const onAssignmentToggle = (checked: boolean, lessonId: string) => {
    if (checked) {
      setAssignmentsIds((prev) => [...prev, lessonId]);
      setIsSelectedAll(assignmentsCount === assignmentsIds.length + 1);
    } else {
      setAssignmentsIds((prev) => prev.filter((_id) => _id !== lessonId));
      setIsSelectedAll(assignmentsCount === assignmentsIds.length - 1);
    }
  };
  // const onAssignmentsScroll = async (e: Event) => {
  //   if (isCloseToBottom(e.target as HTMLElement)) {
  //     fetchMoreAssignments();
  //   }
  // };
  const onAssignmentClick = (_assignmentId: string) => {
    setAssignmentId(_assignmentId);
    setIsEditAssignmentModal(true);
  };
  const onEditAssignmentModalClose = (mutated?: boolean) => {
    setIsEditAssignmentModal(false);

    if (mutated) {
      fetchAssignmentsBySearch(searchText);
    }
  };

  useEffect(() => {}, []);

  // Effects
  useEffect(() => {
    // const throttled = throttleFetch(onAssignmentsScroll);
    // document
    //   .getElementById("content-wrapper")
    //   .addEventListener("scroll", throttled);
    // return () => {
    //   document
    //     .getElementById("content-wrapper")
    //     ?.removeEventListener("scroll", throttled);
    // };
  }, [isSelectedAll, searchText]);
  useEffect(() => throttledSearch(searchText), [searchText]);
  useEffect(() => {
    setIsSelectedAll(assignmentsCount === assignmentsIds.length);
  }, [assignmentsCount]);
  useEffect(() => {
    // Tall screens may fit more than 20 records. This will fit the screen
    // if (assignments.length && assignmentsCount !== assignments.length) {
    //   const contentWrapper = document.getElementById("content-wrapper");
    //   if (contentWrapper.scrollHeight === contentWrapper.clientHeight) {
    //     fetchMoreAssignments();
    //   }
    // }
  }, [assignments, assignmentsCount]);

  return (
    <>
      <p className="section-title">Assignments</p>
      <CardsContainer>
        <Total
          Icon={<AssignmentsIcon size="md" />}
          total={assignmentsCount}
          title="Total assignments"
        />
        {user.role === Role.Teacher && (
          <CreateAssignment
            lessonId={lesson.id}
            onCreated={() => fetchAssignmentsBySearch(searchText, true)}
          />
        )}
      </CardsContainer>{" "}
      {assignmentsIds.length ? (
        <div className="mb-3 flex gap-3">
          <button
            onClick={
              isSelectedAll ? deselectAllAssignments : selectAllAssignments
            }
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAll ? assignmentsCount : assignmentsIds.length}{" "}
            {isSelectedAll ? `Deselect` : "Select all"} <CheckIcon size="xs" />
          </button>
          <button
            onClick={() => setIsDelAssignmentsModal(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Delete <DeleteIcon />
          </button>
        </div>
      ) : (
        <Input
          StartIcon={<SearchIcon size="xs" />}
          placeholder="Search"
          className="w-auto"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      )}
      {isLoading && <Skeleton />}
      {isData && (
        <Table
          data={assignments.map(({ id, title }, idx) => ({
            Name: (
              <CardTitle
                onClick={() => onAssignmentClick(id)}
                checked={assignmentsIds.includes(id)}
                Icon={<AssignmentsIcon size="md" />}
                title={title}
                subtitle=""
                onToggle={
                  user.role === Role.Teacher
                    ? (checked) => onAssignmentToggle(checked, id)
                    : undefined
                }
              />
            ),
            "": user.role === Role.Teacher && (
              <BasePopper
                placement={
                  assignments.length > 7 && assignments.length - idx < 4
                    ? "top"
                    : "bottom"
                }
                width="sm"
                trigger={
                  <button
                    className="icon-button text-neutral-500"
                    onClick={() => setAssignmentId(id)}
                  >
                    <DotsIcon />
                  </button>
                }
              >
                <ul className="flex flex-col">
                  <li
                    className="popper-list-item"
                    onClick={() => setIsDelAssignmentModal(true)}
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
      {isEditAssignmentModal && (
        <EditAssignmentModal
          assignmentId={assignmentId}
          onClose={onEditAssignmentModalClose}
          onSubmissionCreated={() => fetchAssignmentsBySearch(searchText)}
        />
      )}
      {isDelAssignmentsModal && (
        <PromptModal
          isSubmitting={isSubmittingDelAssigns}
          title="Delete assignments"
          action="Delete"
          body={t("prompts.delete_assignments")}
          actionHandler={submitDeleteAssignments}
          onClose={() => setIsDelAssignmentsModal(false)}
        />
      )}
      {isDelAssignmentModal && (
        <PromptModal
          isSubmitting={isSubmittingDelAssign}
          onClose={() => setIsDelAssignmentModal(false)}
          title="Delete assignment"
          action="Delete"
          body={t("prompts.delete_assignment")}
          actionHandler={submitDeleteAssignment}
        />
      )}
    </>
  );
};
export default Assignments;
