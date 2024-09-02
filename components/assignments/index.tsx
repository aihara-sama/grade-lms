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
import Skeleton from "@/components/skeleton";
import { ASSIGNMENTS_GET_LIMIT, LESSONS_GET_LIMIT } from "@/constants";
import {
  deleteAssignmentsByAssignmentsIds,
  deleteAssignmentsByTitleAndLessonId,
  getAssignmentsByLessonId,
  getAssignmentsByTitleAndLessonId,
  getAssignmentsCountByLessonId,
  getAssignmentsCountByTitleAndLessonId,
  getOffsetAssignmentsByTitleAndLessonId,
} from "@/db/assignment";
import { useUser } from "@/hooks/use-user";
import { Role } from "@/interfaces/user.interface";
import type { Assignment } from "@/types/assignments.type";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";
import { isDocCloseToBottom } from "@/utils/is-document-close-to-bottom";
import throttle from "lodash.throttle";
import { useTranslations } from "next-intl";
import type { ChangeEvent, FunctionComponent } from "react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  course: Course;
  lesson: Lesson;
}
const Assignments: FunctionComponent<Props> = ({ course, lesson }) => {
  // States
  const [isDeleteAssignmentsModalOpen, setIsDeleteAssignmentsModalOpen] =
    useState(false);
  const [selectedAssignmentsIds, setSelectedAssignmentsIds] = useState<
    string[]
  >([]);
  const [isDeleteAssignmentModalOpen, setIsDeleteAssignmentModalOpen] =
    useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isAssignmentsLoading, setIsAssignmentsLoading] = useState(true);
  const [totalAssignmentsCount, setTotalAssignmentsCount] = useState(0);
  const [assignmentsSearchText, setAssignmentsSearchText] = useState("");
  const [isSelectedAll, setIsSelectedAll] = useState(false);

  // Refs
  const isSelectedAllRef = useRef(false);
  const assignmentsOffsetRef = useRef(ASSIGNMENTS_GET_LIMIT);
  const assignmentsSearchTextRef = useRef("");

  // Hooks
  const t = useTranslations();
  const { user } = useUser();

  // Handlers
  const selectAllAssignments = () => {
    setSelectedAssignmentsIds(assignments.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllAssignments = () => {
    setSelectedAssignmentsIds([]);
    setIsSelectedAll(false);
  };

  const fetchAssignmentsBySearch = async () => {
    try {
      const [
        assignmentsByTitleAndLessonId,
        assignmentsCountByTitleAndLessonId,
      ] = await Promise.all([
        getAssignmentsByTitleAndLessonId(
          assignmentsSearchTextRef.current,
          lesson.id
        ),
        getAssignmentsCountByTitleAndLessonId(
          assignmentsSearchTextRef.current,
          lesson.id
        ),
      ]);

      setAssignments(assignmentsByTitleAndLessonId);
      setTotalAssignmentsCount(assignmentsCountByTitleAndLessonId);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const fetchAssignmentsWithCount = async () => {
    setIsAssignmentsLoading(true);

    try {
      const [assignmentsByLessonId, assignmentsCountByCourseId] =
        await Promise.all([
          getAssignmentsByLessonId(lesson.id),
          getAssignmentsCountByLessonId(lesson.id),
        ]);

      setAssignments(assignmentsByLessonId);
      setTotalAssignmentsCount(assignmentsCountByCourseId);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsAssignmentsLoading(false);
    }
  };

  const submitDeleteAssignment = async () => {
    try {
      await deleteAssignmentsByAssignmentsIds([selectedAssignmentId]);
      setIsDeleteAssignmentModalOpen(false);
      setSelectedAssignmentsIds((prev) =>
        prev.filter((id) => id !== selectedAssignmentId)
      );
      fetchAssignmentsBySearch();
      toast.success(t("assignment_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const submitDeleteAssignments = async () => {
    try {
      await (isSelectedAllRef.current
        ? deleteAssignmentsByTitleAndLessonId(assignmentsSearchText, lesson.id)
        : deleteAssignmentsByAssignmentsIds(selectedAssignmentsIds));

      setSelectedAssignmentsIds([]);
      setIsDeleteAssignmentsModalOpen(false);
      fetchAssignmentsBySearch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onAssignmentToggle = (checked: boolean, lessonId: string) => {
    if (checked) {
      setSelectedAssignmentsIds((prev) => [...prev, lessonId]);
      setIsSelectedAll(
        totalAssignmentsCount === selectedAssignmentsIds.length + 1
      );
    } else {
      setSelectedAssignmentsIds((prev) =>
        prev.filter((_id) => _id !== lessonId)
      );
      setIsSelectedAll(
        totalAssignmentsCount === selectedAssignmentsIds.length - 1
      );
    }
  };
  const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAssignmentsSearchText(
      (assignmentsSearchTextRef.current = e.target.value)
    );
    fetchAssignmentsBySearch();
  };
  const onAssignmentsScroll = async () => {
    if (isDocCloseToBottom()) {
      try {
        const offsetAssignmentsByUserId =
          await getOffsetAssignmentsByTitleAndLessonId(
            lesson.id,
            assignmentsSearchTextRef.current,
            assignmentsOffsetRef.current,
            assignmentsOffsetRef.current + LESSONS_GET_LIMIT - 1
          );

        setAssignments((prev) => [...prev, ...offsetAssignmentsByUserId]);

        if (isSelectedAllRef.current) {
          setSelectedAssignmentsIds((prev) => [
            ...prev,
            ...offsetAssignmentsByUserId.map(({ id }) => id),
          ]);
        }

        assignmentsOffsetRef.current += offsetAssignmentsByUserId.length;
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };
  const onEditAssignmentModalClose = (mutated?: boolean) => {
    setSelectedAssignmentId(undefined);

    if (mutated) {
      fetchAssignmentsBySearch();
    }
  };

  useEffect(() => {
    const throttled = throttle(onAssignmentsScroll, 300);
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
    fetchAssignmentsWithCount();
  }, []);
  useEffect(() => {
    setIsSelectedAll(totalAssignmentsCount === selectedAssignmentsIds.length);
  }, [totalAssignmentsCount]);
  useEffect(() => {
    assignmentsSearchTextRef.current = assignmentsSearchText;
  }, [assignmentsSearchText]);
  useEffect(() => {
    isSelectedAllRef.current = isSelectedAll;
  }, [isSelectedAll]);

  return (
    <>
      <p className="section-title">Assignments</p>
      <CardsContainer>
        <Total
          Icon={<AssignmentsIcon size="md" />}
          total={totalAssignmentsCount}
          title="Total assignments"
        />
        {user.role === Role.Teacher && (
          <CreateAssignment
            courseId={course.id}
            lessonId={lesson.id}
            onCreated={fetchAssignmentsBySearch}
          />
        )}
      </CardsContainer>{" "}
      {selectedAssignmentsIds.length ? (
        <div className="mb-3 flex gap-3">
          <button
            onClick={
              isSelectedAll ? deselectAllAssignments : selectAllAssignments
            }
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAll
              ? totalAssignmentsCount
              : selectedAssignmentsIds.length}{" "}
            {isSelectedAll ? `Deselect` : "Select all"} <CheckIcon size="xs" />
          </button>
          <button
            onClick={() => setIsDeleteAssignmentsModalOpen(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Delete <DeleteIcon />
          </button>
        </div>
      ) : (
        <Input
          Icon={<SearchIcon size="xs" />}
          placeholder="Search"
          className="w-auto"
          onChange={onSearchInputChange}
          value={assignmentsSearchText}
        />
      )}
      {isAssignmentsLoading ? (
        <Skeleton />
      ) : (
        <Table
          data={assignments.map(({ id, title }) => ({
            Name: (
              <CardTitle
                onClick={() => setSelectedAssignmentId(id)}
                checked={selectedAssignmentsIds.includes(id)}
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
                width="sm"
                trigger={
                  <button
                    className="icon-button text-neutral-500"
                    onClick={() => setSelectedAssignmentId(id)}
                  >
                    <DotsIcon />
                  </button>
                }
              >
                <ul className="flex flex-col">
                  <li
                    className="popper-list-item"
                    onClick={() => setIsDeleteAssignmentModalOpen(false)}
                  >
                    <DeleteIcon /> Delete
                  </li>
                </ul>
              </BasePopper>
            ),
          }))}
        />
      )}
      {selectedAssignmentId && (
        <EditAssignmentModal
          assignmentId={selectedAssignmentId}
          onClose={onEditAssignmentModalClose}
          onSubmissionCreated={fetchAssignmentsBySearch}
        />
      )}
      {isDeleteAssignmentsModalOpen && (
        <PromptModal
          title="Delete assignments"
          action="Delete"
          body={t("prompts.delete_assignments")}
          actionHandler={submitDeleteAssignments}
          onClose={() => setIsDeleteAssignmentsModalOpen(false)}
        />
      )}
      {isDeleteAssignmentModalOpen && (
        <PromptModal
          onClose={() => setIsDeleteAssignmentModalOpen(false)}
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
