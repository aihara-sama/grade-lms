"use client";

import Table from "@/components/common/table";
import Total from "@/components/common/total";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import SearchIcon from "@/components/icons/search-icon";

import { revalidatePageAction } from "@/actions/revalidate-page-action";
import Header from "@/app/[lang]/dashboard/lessons/[lessonId]/components/live-lesson/header";
import TitleCard from "@/components/common/cards/title-card";
import BasicInput from "@/components/common/inputs/basic-input";
import CreateAssignmentModal from "@/components/common/modals/create-assignment-modal";
import ViewAssignmentModal from "@/components/common/modals/edit-assignment-modal";
import PromptDeleteRecordModal from "@/components/common/modals/prompt-delete-record-modal";
import PromptDeleteRecordsModal from "@/components/common/modals/prompt-delete-records-modal";
import NoData from "@/components/common/no-data";
import NotFound from "@/components/common/not-found";
import BasicPopper from "@/components/common/poppers/basic-popper";
import AddAssignmentIcon from "@/components/icons/add-assignment-icon";
import CheckIcon from "@/components/icons/check-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import Container from "@/components/layout/container";
import LoadingSkeleton from "@/components/utilities/skeletons/loading-skeleton";
import { ASSIGNMENTS_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import metadata from "@/data/metadata.json";
import type { createAssignment } from "@/db/client/assignment";
import {
  deleteAllAssignmentsFromLesson,
  deleteAssignment,
  deleteAssignments,
  getLessonAssignments,
} from "@/db/client/assignment";
import { Role } from "@/enums/role.enum";
import useFetchLock from "@/hooks/use-fetch-lock";
import { useLesson } from "@/hooks/use-lesson";
import { useUpdateEffect } from "@/hooks/use-update-effect";
import { useUser } from "@/hooks/use-user";
import type { ResultOf } from "@/types/utils.type";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import { throttleSearch } from "@/utils/throttle/throttle-search";
import throttle from "lodash.throttle";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  assignments: ResultOf<typeof getLessonAssignments>;
}

const Assignments: FunctionComponent<Props> = ({
  assignments: initAssignments,
}) => {
  // Hooks
  const t = useTranslations();
  const user = useUser((state) => state.user);
  const lesson = useLesson((state) => state.lesson);
  const isEnded = useLesson((state) => state.isEnded);

  const fetchLock = useFetchLock();

  // States
  const [isCreateAssignmentModal, setIsCreateAssignmentModal] = useState(false);
  const [isDelAssignmentModal, setIsDelAssignmentModal] = useState(false);
  const [isDelAssignmentsModal, setIsDelAssignmentsModal] = useState(false);
  const [isEditAssignmentModal, setIsEditAssignmentModal] = useState(false);

  const [assignments, setAssignments] = useState(initAssignments.data);
  const [assignmentsCount, setAssignmentsCount] = useState(
    initAssignments.count
  );

  const [assignmentId, setAssignmentId] = useState<string>();
  const [assignmentsIds, setAssignmentsIds] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [isSelectedAll, setIsSelectedAll] = useState(false);

  // Refs
  const assignmentsOffsetRef = useRef(initAssignments.data.length);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // Vars
  const isData = !!assignments.length && !isLoading;
  const isNoData =
    !isLoading && !isSearching && !assignmentsCount && !searchText.length;

  const isNotFound = !isLoading && !assignments.length && !!searchText.length;

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
      const { data, count } = await getLessonAssignments(lesson.id);

      setAssignments(data);
      setAssignmentsCount(count);

      assignmentsOffsetRef.current = data.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchAssignmentsBySearch = async (search: string) => {
    setIsSearching(true);

    try {
      const { data, count } = await getLessonAssignments(lesson.id, search);

      setAssignments(data);
      setAssignmentsCount(count);

      assignmentsOffsetRef.current = data.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSearching(false);
    }
  };
  const fetchMoreAssignments = async () => {
    try {
      const from = assignmentsOffsetRef.current;
      const to = assignmentsOffsetRef.current + ASSIGNMENTS_GET_LIMIT - 1;

      const { data } = await getLessonAssignments(
        lesson.id,
        searchText,
        from,
        to
      );

      setAssignments((prev) => [...prev, ...data]);

      if (isSelectedAll) {
        setAssignmentsIds((prev) => [...prev, ...data.map(({ id }) => id)]);
      }

      assignmentsOffsetRef.current += data.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitDeleteAssignment = async () => {
    try {
      await deleteAssignment(assignmentId);

      setAssignments((prev) => prev.filter(({ id }) => id !== assignmentId));
      setAssignmentsCount((prev) => prev - 1);

      setAssignmentsIds((_) => _.filter((id) => id !== assignmentId));

      setIsDelAssignmentModal(false);

      revalidatePageAction();

      toast.success(t("success.assignment_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const submitDeleteAssignments = async () => {
    try {
      if (isSelectedAll) {
        await deleteAllAssignmentsFromLesson(lesson.id, searchText);
        setAssignments([]);
        setAssignmentsCount(0);
      } else {
        await deleteAssignments(assignmentsIds);
        setAssignments((prev) =>
          prev.filter(({ id }) => !assignmentsIds.includes(id))
        );
        setAssignmentsCount((prev) => prev - assignmentsIds.length);
      }

      setAssignmentsIds([]);
      setIsDelAssignmentsModal(false);

      revalidatePageAction();

      toast.success(t("success.assignments_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onAssignmentToggle = (checked: boolean, lessonId: string) => {
    if (checked) {
      setAssignmentsIds((prev) => [...prev, lessonId]);
      setIsSelectedAll(assignmentsCount === assignmentsIds.length + 1);
    } else {
      setAssignmentsIds((prev) => prev.filter((_id) => _id !== lessonId));
      setIsSelectedAll(assignmentsCount === assignmentsIds.length - 1);
    }
  };

  const onCreateAssignmentModalClose = (
    maybeAssignment?: ResultOf<typeof createAssignment>
  ) => {
    setIsCreateAssignmentModal(false);

    if (maybeAssignment) {
      revalidatePageAction();
      fetchAssignmentsBySearch(searchText);
    }
  };

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

  // Effects
  useUpdateEffect(() => throttledSearch(searchText), [searchText]);

  useEffect(() => {
    if (assignmentsCount)
      setIsSelectedAll(assignmentsCount === assignmentsIds.length);
  }, [assignmentsCount]);

  useEffect(() => {
    // Tall screens may fit more than 20 records
    // This will fit the screen with records
    const fn = throttle(() => {
      if (assignments.length && assignmentsCount !== assignments.length) {
        if (
          contentWrapperRef.current.scrollHeight ===
          contentWrapperRef.current.clientHeight
        ) {
          fetchLock("assignments", fetchMoreAssignments)();
        }
      }
    }, 300);
    fn();

    window.addEventListener("resize", fn);

    return () => {
      window.removeEventListener("resize", fn);
    };
  }, [assignments, assignmentsCount]);

  // View
  return (
    <Container
      ref={contentWrapperRef}
      onScrollEnd={throttleFetch(fetchLock("courses", fetchMoreAssignments))}
    >
      <Header course={lesson.course} />
      <p className="section-title">Assignments</p>
      <div className="mb-6">
        <div className="flex flex-wrap gap-6">
          <Total
            Icon={<AssignmentsIcon size="md" />}
            total={assignmentsCount}
            title="Total assignments"
          />
          {user.role === Role.Teacher && (
            <div className="card">
              <AddAssignmentIcon size="md" />
              <hr className="w-full my-3" />
              <button
                disabled={isEnded}
                className="primary-button px-8"
                onClick={() => setIsCreateAssignmentModal(true)}
              >
                Create
              </button>
            </div>
          )}
        </div>
      </div>

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
            Delete <DeleteIcon size="xs" />
          </button>
        </div>
      ) : (
        <BasicInput
          StartIcon={<SearchIcon size="xs" />}
          placeholder="Search"
          className="w-auto"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      )}
      {isLoading && <LoadingSkeleton />}
      {isData && (
        <Table
          data={assignments.map(({ id, title }, idx) => ({
            Name: (
              <TitleCard
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
              <BasicPopper
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
                    <DeleteIcon size="xs" /> Delete
                  </li>
                </ul>
              </BasicPopper>
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
              disabled={user.role !== "teacher"}
              onClick={() => setIsCreateAssignmentModal(true)}
            >
              Create assignment
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

      {isCreateAssignmentModal && (
        <CreateAssignmentModal
          lessonId={lesson.id}
          onClose={onCreateAssignmentModalClose}
        />
      )}
      {isEditAssignmentModal && (
        <ViewAssignmentModal
          assignmentId={assignmentId}
          onClose={onEditAssignmentModalClose}
          onSubmissionCreated={() => fetchAssignmentsBySearch(searchText)}
        />
      )}
      {isDelAssignmentModal && (
        <PromptDeleteRecordModal
          title={t("modal.titles.delete_assignment")}
          prompt={`${t("prompts.delete_assignment")}`}
          record={assignments.find(({ id }) => id === assignmentId).title}
          confirmText={t("actions.delete")}
          onClose={() => setIsDelAssignmentModal(false)}
          onConfirm={submitDeleteAssignment}
        />
      )}
      {isDelAssignmentsModal && (
        <PromptDeleteRecordsModal
          title={t("modal.titles.delete_assignments")}
          prompt={`${t("prompts.delete_assignments", {
            count: assignmentsIds.length,
          })}`}
          confirmText={t("actions.delete")}
          onClose={() => setIsDelAssignmentsModal(false)}
          onConfirm={submitDeleteAssignments}
        />
      )}
    </Container>
  );
};
export default Assignments;
