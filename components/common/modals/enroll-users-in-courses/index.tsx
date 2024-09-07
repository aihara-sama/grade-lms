import CardTitle from "@/components/card-title";
import BaseModal from "@/components/common/modals/base-modal";
import CheckIcon from "@/components/icons/check-icon";
import CourseIcon from "@/components/icons/course-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Table from "@/components/table";
import { COURSES_GET_LIMIT } from "@/constants";
import { getCourses, getCoursesCount, getUnenrolledCourses } from "@/db/course";
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
  // State
  const [courses, setCourses] = useState<CourseWithRefsCount[]>([]);
  const [selectedCoursesIds, setSelectedCoursesIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [totalCoursesCount, setTotalCoursesCount] = useState(0);

  const isSingleUser = usersIds.length === 1;

  // Hooks
  const t = useTranslations();
  const { user } = useUser();

  // Refs
  const coursesOffsetRef = useRef(0);

  // Handlers
  const selectAllCourses = () => {
    setSelectedCoursesIds(courses.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllCourses = () => {
    setSelectedCoursesIds([]);
    setIsSelectedAll(false);
  };

  const fetchCourses = async (merge?: boolean) => {
    try {
      const [fetchedCourses, fetchedCoursesCount] = await Promise.all([
        isSingleUser
          ? getUnenrolledCourses(
              usersIds[0],
              merge ? coursesOffsetRef.current : 0,
              coursesOffsetRef.current + COURSES_GET_LIMIT - 1
            )
          : getCourses(
              user.id,
              undefined,
              merge ? coursesOffsetRef.current : 0,
              coursesOffsetRef.current + COURSES_GET_LIMIT - 1
            ),
        getCoursesCount(user.id),
      ]);
      setCourses(fetchedCourses);
      setTotalCoursesCount(fetchedCoursesCount);

      if (isSelectedAll) {
        setSelectedCoursesIds((prev) => [
          ...prev,
          ...fetchedCourses.map(({ id }) => id),
        ]);
      }
      coursesOffsetRef.current =
        fetchedCourses.length + (merge ? coursesOffsetRef.current : 0);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitEnrollUsers = async () => {
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

  const onUserToggle = (checked: boolean, userId: string) => {
    if (checked) {
      setSelectedCoursesIds((prev) => [...prev, userId]);
      setIsSelectedAll(totalCoursesCount === selectedCoursesIds.length + 1);
    } else {
      setSelectedCoursesIds((prev) => prev.filter((_id) => _id !== userId));
      setIsSelectedAll(totalCoursesCount === selectedCoursesIds.length - 1);
    }
  };

  const onScrollEnd = useCallback(throttleFetch(fetchCourses), [
    searchText,
    isSelectedAll,
  ]);

  // Effects
  useEffect(() => {
    fetchCourses(false);
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
              onToggle={(checked) => onUserToggle(checked, id)}
            />
          ),
          "": "",
        }))}
      />
      <div className="flex justify-end gap-3 mt-4">
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
