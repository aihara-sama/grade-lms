import BaseModal from "@/components/common/modals/base-modal";
import DateInput from "@/components/date-input";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import { createAssignment } from "@/db/assignment";
import { getAllCourseStudentsIds } from "@/db/user";
import { NotificationType } from "@/interfaces/notifications.interface";
import type { IUserMetadata } from "@/interfaces/user.interface";
import { Role } from "@/interfaces/user.interface";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";
import type { Notification } from "@/types/notifications";
import type { TablesInsert } from "@/types/supabase.type";
import { getNextMorning } from "@/utils/get-next-morning";
import { getNotificationChannel } from "@/utils/get-notification-channel";
import { supabaseClient } from "@/utils/supabase/client";
import type { OutputData } from "@editorjs/editorjs";
import type { User } from "@supabase/supabase-js";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import type {
  ChangeEvent,
  Dispatch,
  FunctionComponent,
  SetStateAction,
} from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});
const getInitAssignment = (lessonId: string): TablesInsert<"assignments"> => ({
  lesson_id: lessonId,
  title: "",
  body: "{}",
  due_date: format(getNextMorning(), "yyyy-MM-dd'T'HH:mm:ss"),
});

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDone: () => void;
  user: User;
  course: Course;
  lesson: Lesson;
}
const CreateAssignmentModal: FunctionComponent<IProps> = ({
  onDone,
  user,
  course,
  lesson,
  isOpen,
  setIsOpen,
}) => {
  // States
  const [assignment, setAssignment] = useState(getInitAssignment(lesson.id));

  // Hooks
  const t = useTranslations();

  // Handlers
  const handleCreateAssignment = async () => {
    try {
      const createdAssignment = await createAssignment(assignment);

      const students = await getAllCourseStudentsIds(user.id, course.id);

      await supabaseClient.from("notifications").insert(
        students.map(({ id }) => ({
          user_id: id,
          assignment_id: createdAssignment.id,
          course_id: course.id,
          lesson_id: lesson.id,
          is_read: false,
          type: NotificationType.Assignment,
        })) as Notification[]
      );

      const room =
        (user.user_metadata as IUserMetadata).role === Role.TEACHER
          ? user.id
          : (user.user_metadata as IUserMetadata).creator_id;

      getNotificationChannel(room).send({
        event: "notification",
        type: "broadcast",
      });

      toast.success(t("assignment_created"));
      setIsOpen(false);
      onDone();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setAssignment((_) => ({ ..._, [e.target.name]: e.target.value }));

  const handleBodyChange = (data: OutputData) =>
    setAssignment((_) => ({
      ..._,
      body: JSON.stringify(data),
    }));

  const handleDateChange = (date: Date) => {
    setAssignment((_) => ({
      ..._,
      due_date: format(date, "yyyy-MM-dd'T'HH:mm:ss"),
    }));
  };

  useEffect(() => {
    if (!isOpen) setAssignment(getInitAssignment(lesson.id));
  }, [isOpen]);

  return (
    <BaseModal
      width="lg"
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      title="Assignment"
    >
      <div>
        <Input
          autoFocus
          fullWIdth
          Icon={<LessonsIcon size="xs" />}
          placeholder="Assignment name"
          name="title"
          onChange={handleInputChange}
          value={assignment.title}
        />
        <p>Description</p>
        <div className="min-h-[298px]">
          <Editor
            height="md"
            onChange={handleBodyChange}
            data={JSON.parse(assignment.body)}
          />
        </div>

        <div className="flex gap-3 items-center mt-3 justify-end">
          <div className="pr-3 border-r-2 border-gray-200">
            <DateInput
              date={new Date(assignment.due_date)}
              onChange={handleDateChange}
              label="Due date"
              popperPlacement="top-start"
            />
          </div>
          <button
            disabled={!assignment.title}
            className="primary-button"
            onClick={handleCreateAssignment}
          >
            Create
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default CreateAssignmentModal;
