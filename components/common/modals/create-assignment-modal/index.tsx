import BaseModal from "@/components/common/modals/base-modal";
import DateInput from "@/components/date-input";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import { createAssignment } from "@/db/assignment";
import { getAllCourseStudentsIds } from "@/db/user";
import { useUser } from "@/hooks/use-user";
import { NotificationType } from "@/interfaces/notifications.interface";
import { Role } from "@/interfaces/user.interface";
import { Event } from "@/types/events.type";
import type { Notification } from "@/types/notifications";
import type { TablesInsert } from "@/types/supabase.type";
import { getNextMorning } from "@/utils/get-next-morning";
import { getNotificationChannel } from "@/utils/get-notification-channel";
import { supabaseClient } from "@/utils/supabase/client";
import type { OutputData } from "@editorjs/editorjs";
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
  courseId: string;
  lessonId: string;
}
const CreateAssignmentModal: FunctionComponent<IProps> = ({
  onDone,
  courseId,
  lessonId,
  isOpen,
  setIsOpen,
}) => {
  // States
  const [assignment, setAssignment] = useState<TablesInsert<"assignments">>();

  // Hooks
  const t = useTranslations();
  const { user } = useUser();

  // Handlers
  const submitCreateAssignment = async () => {
    try {
      const [createdAssignment, students] = await Promise.all([
        createAssignment(assignment),
        getAllCourseStudentsIds(user.id, courseId),
      ]);

      const { error } = await supabaseClient.from("notifications").insert(
        students.map(({ id }) => ({
          user_id: id,
          assignment_id: createdAssignment.id,
          course_id: courseId,
          lesson_id: lessonId,
          is_read: false,
          type: NotificationType.Assignment,
        })) as Notification[]
      );

      if (error) console.error(error);

      const room = user.role === Role.Teacher ? user.id : user.creator_id;

      getNotificationChannel(room).send({
        event: Event.NotificationCreated,
        type: "broadcast",
      });

      toast.success(t("assignment_created"));
      setIsOpen(false);
      onDone();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setAssignment((_) => ({ ..._, [e.target.name]: e.target.value }));

  const onBodyChange = (data: OutputData) =>
    setAssignment((_) => ({
      ..._,
      body: JSON.stringify(data),
    }));

  const onDateChange = (date: Date) => {
    setAssignment((_) => ({
      ..._,
      due_date: format(date, "yyyy-MM-dd'T'HH:mm:ss"),
    }));
  };

  useEffect(() => {
    if (!isOpen) setAssignment(getInitAssignment(lessonId));
  }, [isOpen]);

  if (!assignment) return null;

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
          onChange={onInputChange}
          value={assignment.title}
        />
        <p>Description</p>
        <div className="min-h-[298px]">
          <Editor
            id="create-assignment-editor"
            height="lg"
            onChange={onBodyChange}
            data={JSON.parse(assignment.body)}
          />
        </div>

        <div className="flex gap-3 items-center mt-3 justify-end">
          <div className="pr-3 border-r-2 border-gray-200">
            <DateInput
              date={new Date(assignment.due_date)}
              onChange={onDateChange}
              label="Due date"
              popperPlacement="top-start"
            />
          </div>
          <button
            disabled={!assignment.title}
            className="primary-button"
            onClick={submitCreateAssignment}
          >
            Create
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default CreateAssignmentModal;
