import CardTitle from "@/components/card-title";
import BaseModal from "@/components/common/modals/base-modal";
import CourseIcon from "@/components/icons/course-icon";
import Table from "@/components/table";
import {
  getCoursesWithRefsCountByUserId,
  getUnenrolledCoursesByUserId,
} from "@/db/course";
import { enrollUsersInCourses } from "@/db/user";
import { useUser } from "@/hooks/use-user";
import type { CourseWithRefsCount } from "@/types/courses.type";
import { db } from "@/utils/supabase/client";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
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

  const isSingleUser = usersIds.length === 1;

  // Hooks
  const t = useTranslations();
  const { user } = useUser();

  // Handlers
  const getCourses = async () => {
    try {
      setCourses(
        await (isSingleUser
          ? getUnenrolledCoursesByUserId(usersIds[0])
          : getCoursesWithRefsCountByUserId(user.id))
      );
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
    } else {
      setSelectedCoursesIds((prev) => prev.filter((_id) => _id !== userId));
    }
  };
  // Effects
  useEffect(() => {
    getCourses();
  }, []);

  // View
  return (
    <BaseModal onClose={onClose} title="Enrollment">
      <p className="mb-3 text-neutral-500">Select courses to enroll</p>
      <Table
        compact
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
