import CardTitle from "@/components/card-title";
import BaseModal from "@/components/common/modals/base-modal";
import CourseIcon from "@/components/icons/course-icon";
import Table from "@/components/table";
import {
  getCoursesWithRefsCountByUserId,
  getUnenrolledCoursesByUserId,
} from "@/db/course";
import { checkEvents } from "@/db/lesson";
import { enrollUsersInCourses } from "@/db/user";
import { useUser } from "@/hooks/use-user";
import type { CourseWithRefsCount } from "@/types/courses.type";
import { useTranslations } from "next-intl";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  usersIds: string[];
  onDone: () => void;
}

const EnrollUsersInCoursesModal: FunctionComponent<IProps> = ({
  isOpen,
  setIsOpen,
  usersIds,
  onDone,
}) => {
  // State
  const [courses, setCourses] = useState<CourseWithRefsCount[]>([]);
  const [selectedCoursesIds, setSelectedCoursesIds] = useState<string[]>([]);

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

  const handleEnrollUsers = async () => {
    try {
      await enrollUsersInCourses(usersIds, selectedCoursesIds);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsOpen(false);
      setSelectedCoursesIds([]);
      toast.success(t(isSingleUser ? "user_enrolled" : "users_enrolled"));
      onDone();
      checkEvents();
    }
  };
  const closeModal = () => setIsOpen(false);
  const onUserToggle = (checked: boolean, userId: string) => {
    if (checked) {
      setSelectedCoursesIds((prev) => [...prev, userId]);
    } else {
      setSelectedCoursesIds((prev) => prev.filter((_id) => _id !== userId));
    }
  };
  // Effects
  useEffect(() => {
    if (isOpen) {
      getCourses();
    } else {
      setSelectedCoursesIds([]);
    }
  }, [isOpen]);

  // View
  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} title="Enrollment">
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
        <button className="outline-button" onClick={closeModal}>
          Cancel
        </button>
        <button
          disabled={!selectedCoursesIds.length}
          className="primary-button"
          onClick={handleEnrollUsers}
        >
          Enroll
        </button>
      </div>
    </BaseModal>
  );
};

export default EnrollUsersInCoursesModal;
