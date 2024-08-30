"use client";

import CardTitle from "@/components/card-title";
import CardsContainer from "@/components/cards-container";
import PromptModal from "@/components/common/modals/prompt-modal";
import CreateCourse from "@/components/courses/create-course";
import CheckIcon from "@/components/icons/check-icon";
import CourseIcon from "@/components/icons/course-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Table from "@/components/table";
import Total from "@/components/total";
import type { CourseWithRefsCount } from "@/types/courses.type";
import throttle from "lodash.throttle";
import type { ChangeEvent, FunctionComponent } from "react";
import { useEffect, useRef, useState } from "react";

import CourseOptionsPopper from "@/components/common/poppers/course-options-popper";
import Skeleton from "@/components/skeleton";
import { COURSES_GET_LIMIT } from "@/constants";
import {
  deleteCoursesByCoursesIds,
  deleteCoursesByTitleAndUserId,
  getCoursesByTitleAndUserId,
  getCoursesCountByTitleAndUserId,
  getCoursesCountByUserId,
  getCoursesWithRefsCountByUserId,
  getOffsetCoursesByTitleAndUserId,
} from "@/db/course";
import { useUser } from "@/hooks/use-user";
import { Role } from "@/interfaces/user.interface";
import { isDocCloseToBottom } from "@/utils/is-document-close-to-bottom";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface IProps {}

const Courses: FunctionComponent<IProps> = () => {
  // State
  const [isDeleteCoursesModalOpen, setIsDeleteCoursesModalOpen] =
    useState(false);
  const [selectedCoursesIds, setSelectedCoursesIds] = useState<string[]>([]);
  const [courses, setCourses] = useState<CourseWithRefsCount[]>([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(true);
  const [totalCoursesCount, setTotalCoursesCount] = useState(0);
  const [coursesSearchText, setCoursesSearchText] = useState("");
  const [isSelectedAll, setIsSelectedAll] = useState(false);

  // Refs
  const isSelectedAllRef = useRef(false);
  const coursesSearchTextRef = useRef("");
  const coursesOffsetRef = useRef(COURSES_GET_LIMIT);

  // Hooks
  const t = useTranslations();
  const { user } = useUser();

  // Handdlers
  const fetchCoursesWithCount = async () => {
    setIsCoursesLoading(true);

    try {
      const [coursesByUserId, coursesCountByUserId] = await Promise.all([
        getCoursesWithRefsCountByUserId(user.id),
        getCoursesCountByUserId(user.id),
      ]);

      setCourses(coursesByUserId);
      setTotalCoursesCount(coursesCountByUserId);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsCoursesLoading(false);
    }
  };

  const openDeleteCoursesModal = () => setIsDeleteCoursesModalOpen(true);
  const onCourseToggle = (checked: boolean, courseId: string) => {
    if (checked) {
      setSelectedCoursesIds((prev) => [...prev, courseId]);
      setIsSelectedAll(totalCoursesCount === selectedCoursesIds.length + 1);
    } else {
      setSelectedCoursesIds((prev) => prev.filter((_id) => _id !== courseId));
      setIsSelectedAll(totalCoursesCount === selectedCoursesIds.length - 1);
    }
  };
  const selectAllCourses = () => {
    setSelectedCoursesIds(courses.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllCourses = () => {
    setSelectedCoursesIds([]);
    setIsSelectedAll(false);
  };
  const fetchCoursesBySearch = async () => {
    try {
      const [coursesByTitleAndUserId, coursesCountByTitleAndUserId] =
        await Promise.all([
          getCoursesByTitleAndUserId(coursesSearchTextRef.current, user.id),
          getCoursesCountByTitleAndUserId(
            coursesSearchTextRef.current,
            user.id
          ),
        ]);

      setCourses(coursesByTitleAndUserId);
      setTotalCoursesCount(coursesCountByTitleAndUserId);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCoursesSearchText((coursesSearchTextRef.current = e.target.value));
    fetchCoursesBySearch();
  };
  const handleCoursesScroll = async () => {
    if (isDocCloseToBottom()) {
      try {
        const rangeCoursesByUserId = await getOffsetCoursesByTitleAndUserId(
          user.id,
          coursesSearchTextRef.current,
          coursesOffsetRef.current,
          coursesOffsetRef.current + COURSES_GET_LIMIT - 1
        );

        setCourses((prev) => [...prev, ...rangeCoursesByUserId]);

        if (isSelectedAllRef.current) {
          setSelectedCoursesIds((prev) => [
            ...prev,
            ...rangeCoursesByUserId.map(({ id }) => id),
          ]);
        }

        coursesOffsetRef.current += rangeCoursesByUserId.length;
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const deleteSelectedCourses = async () => {
    try {
      await (isSelectedAllRef.current
        ? deleteCoursesByTitleAndUserId(coursesSearchText, user.id)
        : deleteCoursesByCoursesIds(selectedCoursesIds));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSelectedCoursesIds([]);
      setIsDeleteCoursesModalOpen(false);
      fetchCoursesBySearch();
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
    fetchCoursesWithCount();
  }, []);
  useEffect(() => {
    coursesSearchTextRef.current = coursesSearchText;
  }, [coursesSearchText]);
  useEffect(() => {
    isSelectedAllRef.current = isSelectedAll;
  }, [isSelectedAll]);
  useEffect(() => {
    setIsSelectedAll(totalCoursesCount === selectedCoursesIds.length);
  }, [totalCoursesCount]);
  return (
    <div className="pb-8 flex-1 flex flex-col">
      <CardsContainer>
        <Total
          Icon={<CoursesIcon size="lg" />}
          total={totalCoursesCount}
          title="Total courses"
        />
        {user.role === Role.Teacher && (
          <CreateCourse onDone={fetchCoursesBySearch} />
        )}
      </CardsContainer>
      {selectedCoursesIds.length ? (
        <div className="mb-3 flex gap-3">
          <button
            onClick={isSelectedAll ? deselectAllCourses : selectAllCourses}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAll ? totalCoursesCount : selectedCoursesIds.length}{" "}
            {isSelectedAll ? `Deselect` : "Select all"} <CheckIcon size="xs" />
          </button>
          <button
            onClick={openDeleteCoursesModal}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Delete <DeleteIcon />
          </button>
        </div>
      ) : (
        <Input
          Icon={<SearchIcon size="xs" />}
          placeholder={t("search")}
          className="w-auto"
          onChange={handleSearchInputChange}
          value={coursesSearchText}
        />
      )}
      {isCoursesLoading ? (
        <Skeleton />
      ) : (
        <div className="flex-1 flex">
          <Table
            data={courses.map(({ id, title, lessons, users: members }) => ({
              Name: (
                <CardTitle
                  href={`/dashboard/courses/${id}/overview`}
                  checked={selectedCoursesIds.includes(id)}
                  Icon={<CourseIcon />}
                  title={title}
                  subtitle="Active"
                  onToggle={
                    user.role === Role.Teacher
                      ? (checked) => onCourseToggle(checked, id)
                      : undefined
                  }
                />
              ),
              Lessons: lessons[0].count,
              Members: members[0].count,
              "": user.role === Role.Teacher && (
                <CourseOptionsPopper
                  onDone={fetchCoursesBySearch}
                  setSelectedCoursesIds={setSelectedCoursesIds}
                  courseId={id}
                />
              ),
            }))}
          />
        </div>
      )}

      <PromptModal
        setIsOpen={setIsDeleteCoursesModalOpen}
        isOpen={isDeleteCoursesModalOpen}
        title="Delete courses"
        action="Delete"
        body="Are you sure you want to delete selected courses?"
        actionHandler={deleteSelectedCourses}
      />
    </div>
  );
};

export default Courses;
