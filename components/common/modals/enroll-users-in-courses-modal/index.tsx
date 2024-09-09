import CardTitle from "@/components/card-title";
import BaseModal from "@/components/common/modals/base-modal";
import CheckIcon from "@/components/icons/check-icon";
import CourseIcon from "@/components/icons/course-icon";
import NoDataIcon from "@/components/icons/no-data-icon";
import NotFoundIcon from "@/components/icons/not-found-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Skeleton from "@/components/skeleton";
import Table from "@/components/table";
import { COURSES_GET_LIMIT } from "@/constants";
import {
  getCourses,
  getCoursesCount,
  getUnenrolledCourses,
  getUnenrolledCoursesCount,
} from "@/db/course";
import { enrollUsersInCourses } from "@/db/user";
import { useUser } from "@/hooks/use-user";
import type { CourseWithRefsCount } from "@/types/courses.type";
import { db } from "@/utils/supabase/client";
import { throttleFetch } from "@/utils/throttle-fetch";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  onClose: (mutated?: boolean) => void;
  usersIds: string[];
}

const EnrollUsersInCoursesModal: FunctionComponent<Props> = ({
  usersIds,
  onClose,
}) => {
  console.log({ usersIds });

  // State
  const [courses, setCourses] = useState<CourseWithRefsCount[]>([]);
  const [selectedCoursesIds, setSelectedCoursesIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [totalCoursesCount, setTotalCoursesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const isSingleUser = usersIds.length === 1;

  // Hooks
  const t = useTranslations();
  const { user } = useUser();

  // Refs
  const coursesOffsetRef = useRef(0);

  // Vars
  const isData = !!courses.length && !isLoading;
  const isNoData =
    !isLoading && !isSearching && !totalCoursesCount && !searchText.length;

  const isNotFound =
    !isLoading && !isSearching && !courses.length && !!searchText.length;

  // Handlers
  const selectAllCourses = () => {
    setSelectedCoursesIds(courses.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllCourses = () => {
    setSelectedCoursesIds([]);
    setIsSelectedAll(false);
  };

  const fetchInitialCourses = async () => {
    setIsLoading(true);

    try {
      const [fetchedCourses, fetchedCoursesCount] = await Promise.all([
        isSingleUser ? getUnenrolledCourses(usersIds[0]) : getCourses(user.id),
        isSingleUser
          ? getUnenrolledCoursesCount(usersIds[0])
          : getCoursesCount(user.id),
      ]);

      setCourses(fetchedCourses);
      setTotalCoursesCount(fetchedCoursesCount);

      if (isSelectedAll) {
        setSelectedCoursesIds((prev) => [
          ...prev,
          ...fetchedCourses.map(({ id }) => id),
        ]);
      }
      coursesOffsetRef.current = fetchedCourses.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCoursesBySearch = async (refetch?: boolean) => {
    setIsSearching(true);

    try {
      const [fetchedCourses, fetchedCoursesCount] = await Promise.all([
        isSingleUser
          ? getUnenrolledCourses(usersIds[0], searchText)
          : getCourses(user.id, searchText),
        isSingleUser
          ? getUnenrolledCoursesCount(usersIds[0], searchText)
          : getCoursesCount(user.id, searchText),
      ]);

      setCourses(fetchedCourses);
      setTotalCoursesCount(fetchedCoursesCount);

      setIsSelectedAll(false);
      setSelectedCoursesIds([]);

      coursesOffsetRef.current += refetch ? fetchedCourses.length : 0;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchMoreCourses = async () => {
    try {
      const from = coursesOffsetRef.current;
      const to = coursesOffsetRef.current + COURSES_GET_LIMIT - 1;

      const fetchedCourses = await (isSingleUser
        ? getUnenrolledCourses(usersIds[0], searchText, from, to)
        : getCourses(user.id, searchText, from, to));

      setCourses((prev) => [...prev, ...fetchedCourses]);

      if (isSelectedAll) {
        setSelectedCoursesIds((prev) => [
          ...prev,
          ...fetchedCourses.map(({ id }) => id),
        ]);
      }

      coursesOffsetRef.current += fetchedCourses.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitEnrollUsers = async () => {
    console.log({ usersIds, selectedCoursesIds });

    setIsSubmitting(true);
    try {
      await enrollUsersInCourses(usersIds, selectedCoursesIds);
      onClose(true);
      toast.success(t(isSingleUser ? "user_enrolled" : "users_enrolled"));
      db.functions.invoke("check-events");
      setSelectedCoursesIds([]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCourseToggle = (checked: boolean, courseId: string) => {
    if (checked) {
      setSelectedCoursesIds((prev) => [...prev, courseId]);
      setIsSelectedAll(totalCoursesCount === selectedCoursesIds.length + 1);
    } else {
      setSelectedCoursesIds((prev) => prev.filter((_id) => _id !== courseId));
      setIsSelectedAll(totalCoursesCount === selectedCoursesIds.length - 1);
    }
  };

  const onScrollEnd = useCallback(throttleFetch(fetchMoreCourses), [
    searchText,
    isSelectedAll,
  ]);

  // Effects
  useEffect(() => {
    if (searchText) {
      fetchCoursesBySearch();
    } else {
      fetchInitialCourses();
    }
  }, [searchText]);
  // View
  return (
    <BaseModal onClose={onClose} title="Enrollment">
      <p className="mb-3 text-neutral-500">Select courses to enroll</p>
      {selectedCoursesIds.length ? (
        <div className="mb-3 flex gap-3">
          <button
            onClick={isSelectedAll ? deselectAllCourses : selectAllCourses}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAll ? totalCoursesCount : selectedCoursesIds.length}{" "}
            {isSelectedAll ? `Deselect` : "Select all"} <CheckIcon size="xs" />
          </button>
        </div>
      ) : (
        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          Icon={<SearchIcon />}
          autoFocus
          placeholder="Search..."
        />
      )}

      {isLoading && <Skeleton className="h-[282px]" />}
      {isData && (
        <Table
          compact
          onScrollEnd={onScrollEnd}
          data={courses.map(({ id, title }) => ({
            Name: (
              <CardTitle
                href={`/dashboard/courses/${id}/overview`}
                checked={selectedCoursesIds.includes(id)}
                Icon={<CourseIcon />}
                title={title}
                subtitle="Active"
                onClick={() => {}}
                onToggle={(checked) => onCourseToggle(checked, id)}
              />
            ),
            "": "",
          }))}
        />
      )}
      {isNoData && (
        <div className="flex justify-center mt-12 h-[234px]">
          <div className="flex flex-col items-center">
            <NoDataIcon size="xl" />
            <p className="mt-4 font-bold">View your work in a list</p>
          </div>
        </div>
      )}
      {isNotFound && (
        <div className="flex justify-center mt-12 h-[234px]">
          <div className="flex flex-col items-center">
            <NotFoundIcon size="xl" />
            <p className="mt-4 font-bold text-center">
              It looks like we can&apos;t find any results for that match
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-auto">
        <button className="outline-button" onClick={() => onClose()}>
          Cancel
        </button>
        <button
          disabled={!selectedCoursesIds.length}
          className="primary-button"
          onClick={submitEnrollUsers}
        >
          {isSubmitting && (
            <img
              className="loading-spinner"
              src="/gifs/loading-spinner.gif"
              alt=""
            />
          )}
          <span className={`${clsx(isSubmitting && "opacity-0")}`}>Enroll</span>
        </button>
      </div>
    </BaseModal>
  );
};

export default EnrollUsersInCoursesModal;