import TitleCard from "@/components/common/cards/title-card";
import BasicInput from "@/components/common/inputs/basic-input";
import BasicModal from "@/components/common/modals/basic-modal";
import NotFound from "@/components/common/not-found";
import Table from "@/components/common/table";
import CheckIcon from "@/components/icons/check-icon";
import CourseIcon from "@/components/icons/course-icon";
import SearchIcon from "@/components/icons/search-icon";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import LoadingSkeleton from "@/components/utilities/skeletons/loading-skeleton";
import { COURSES_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import { getCourses, getUnenrolledCourses } from "@/db/client/course";
import {
  enrollAllUsersInAllCourses,
  enrollAllUsersInCourses,
  enrollUsersInAllCourses,
  enrollUsersInCourses,
} from "@/db/client/user";
import useFetchLock from "@/hooks/use-fetch-lock";
import { DB } from "@/lib/supabase/db";
import type { CourseWithRefsCount } from "@/types/course.type";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import { throttleSearch } from "@/utils/throttle/throttle-search";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  onClose: (mutated?: boolean) => void;
  usersIds: string[];
  shouldEnrollAll?: boolean;
}

const EnrollUsersInCoursesModal: FunctionComponent<Props> = ({
  usersIds,
  shouldEnrollAll,
  onClose,
}) => {
  // Hooks
  const t = useTranslations();
  const fetchLock = useFetchLock();

  // State
  const [courses, setCourses] = useState<CourseWithRefsCount[]>([]);
  const [coursesIds, setCoursesIds] = useState<string[]>([]);

  const [searchText, setSearchText] = useState("");
  const [coursesCount, setCoursesCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSelectedAll, setIsSelectedAll] = useState(false);

  const isSingleUser = usersIds.length === 1;
  // Refs
  const coursesOffsetRef = useRef(0);

  // Vars
  const isData = !!courses.length && !isLoading;
  const isNoData =
    !isLoading && !isSearching && !coursesCount && !searchText.length;

  const isNotFound =
    !isLoading && !isSearching && !courses.length && !!searchText.length;

  // Handlers
  const selectAllCourses = () => {
    setCoursesIds(courses.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllCourses = () => {
    setCoursesIds([]);
    setIsSelectedAll(false);
  };

  const fetchInitialCourses = async () => {
    setIsLoading(true);

    try {
      const { data, count } = await (isSingleUser
        ? getUnenrolledCourses(usersIds[0])
        : getCourses());

      setCourses(data);
      setCoursesCount(count);

      coursesOffsetRef.current = data.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCoursesBySearch = async (search: string) => {
    setIsSearching(true);

    try {
      const { data, count } = await (isSingleUser
        ? getUnenrolledCourses(usersIds[0], search)
        : getCourses(search));

      setCourses(data);
      setCoursesCount(count);

      coursesOffsetRef.current = data.length;
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

      const { data } = await (isSingleUser
        ? getUnenrolledCourses(usersIds[0], searchText, from, to)
        : getCourses(searchText, from, to));

      setCourses((prev) => [...prev, ...data]);

      if (isSelectedAll) {
        setCoursesIds((prev) => [...prev, ...data.map(({ id }) => id)]);
      }

      coursesOffsetRef.current += data.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitEnrollUsers = async () => {
    setIsSubmitting(true);

    try {
      if (shouldEnrollAll) {
        if (isSelectedAll) await enrollAllUsersInAllCourses();
        else await enrollAllUsersInCourses(coursesIds);
      }
      if (!shouldEnrollAll) {
        if (isSelectedAll) await enrollUsersInAllCourses(usersIds);
        else await enrollUsersInCourses(usersIds, coursesIds);
      }

      onClose(true);
      setCoursesIds([]);

      toast.success(
        t(isSingleUser ? "success.user_enrolled" : "success.users_enrolled")
      );

      DB.functions.invoke("check-events");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCourseToggle = (checked: boolean, courseId: string) => {
    if (checked) {
      setCoursesIds((prev) => [...prev, courseId]);
      setIsSelectedAll(coursesCount === coursesIds.length + 1);
    } else {
      setCoursesIds((prev) => prev.filter((_id) => _id !== courseId));
      setIsSelectedAll(coursesCount === coursesIds.length - 1);
    }
  };

  const throttledSearch = useCallback(
    throttleSearch((search) => {
      if (search) {
        fetchCoursesBySearch(search);
      } else {
        fetchInitialCourses();
      }
    }, THROTTLE_SEARCH_WAIT),
    []
  );

  // Effects
  useEffect(() => throttledSearch(searchText), [searchText]);

  useEffect(() => {
    if (coursesCount) setIsSelectedAll(coursesCount === coursesIds.length);
  }, [coursesCount]);

  // View
  return (
    <BasicModal
      onClose={() => onClose()}
      title="Enrollment"
      isFixedHeight={false}
    >
      <p className="mb-3 text-neutral-500">
        {t("common.select_courses_to_enroll")}
      </p>
      {coursesIds.length ? (
        <div className="mb-3 flex gap-3">
          <button
            onClick={isSelectedAll ? deselectAllCourses : selectAllCourses}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAll ? coursesCount : coursesIds.length}{" "}
            {isSelectedAll ? t("buttons.deselect") : t("buttons.select_all")}{" "}
            <CheckIcon size="xs" />
          </button>
        </div>
      ) : (
        <BasicInput
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          StartIcon={<SearchIcon />}
          autoFocus
          placeholder={t("placeholders.search")}
        />
      )}

      {isLoading && <LoadingSkeleton className="h-[222px]" />}
      {isData && (
        <Table
          className="mb-2"
          compact
          onScrollEnd={throttleFetch(fetchLock("courses", fetchMoreCourses))}
          data={courses.map(({ id, title }) => ({
            Name: (
              <TitleCard
                checked={coursesIds.includes(id)}
                Icon={<CourseIcon />}
                title={title}
                subtitle={t("statuses.active")}
                onClick={() => {}}
                onToggle={(checked) => onCourseToggle(checked, id)}
              />
            ),
          }))}
        />
      )}
      {(isNoData || isNotFound) && (
        <NotFound variant="secondary" action={null} />
      )}

      <div className="flex justify-end gap-3 mt-auto">
        <button className="outline-button" onClick={() => onClose()}>
          {t("buttons.cancel")}
        </button>
        <button
          disabled={!coursesIds.length}
          className="primary-button"
          onClick={submitEnrollUsers}
        >
          {isSubmitting && <LoadingSpinner />}
          <span className={`${clsx(isSubmitting && "opacity-0")}`}>
            {t("buttons.enroll")}
          </span>
        </button>
      </div>
    </BasicModal>
  );
};

export default EnrollUsersInCoursesModal;
