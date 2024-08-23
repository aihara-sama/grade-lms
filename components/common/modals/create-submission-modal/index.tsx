import BaseModal from "@/components/common/modals/base-modal";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import { createNotification } from "@/db/notification";
import { createSubmission } from "@/db/submission";
import { NotificationType } from "@/interfaces/notifications.interface";
import type { IUserMetadata } from "@/interfaces/user.interface";
import { Role } from "@/interfaces/user.interface";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";
import type { TablesInsert } from "@/types/supabase.type";
import { getNotificationChannel } from "@/utils/get-notification-channel";
import type { OutputData } from "@editorjs/editorjs";
import type { User } from "@supabase/supabase-js";
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
const getInitSubmission = (
  assignmentId: string,
  userId: string
): TablesInsert<"submissions"> => ({
  user_id: userId,
  title: "My Submission",
  body: "{}",
  assignment_id: assignmentId,
});

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDone: () => void;
  user: User;
  course: Course;
  lesson: Lesson;
  assignmentId: string;
}
const CreateSubmissionModal: FunctionComponent<IProps> = ({
  onDone,
  user,
  course,
  lesson,
  isOpen,
  setIsOpen,
  assignmentId,
}) => {
  // States
  const [submission, setSubmission] = useState(
    getInitSubmission(assignmentId, user.id)
  );

  // Hooks
  const t = useTranslations();

  // Handlers
  const handleCreateAssignment = async () => {
    try {
      const createdSubmission = await createSubmission(submission);

      await createNotification({
        user_id: (user.user_metadata as IUserMetadata).creator_id,
        submission_id: createdSubmission.id,
        assignment_id: assignmentId,
        course_id: course.id,
        lesson_id: lesson.id,
        is_read: false,
        type: NotificationType.Submission,
      });

      const room =
        (user.user_metadata as IUserMetadata).role === Role.TEACHER
          ? user.id
          : (user.user_metadata as IUserMetadata).creator_id;

      getNotificationChannel(room).send({
        event: "notification",
        type: "broadcast",
      });

      toast.success(t("submission_created"));
      setIsOpen(false);
      onDone();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSubmission((_) => ({ ..._, [e.target.name]: e.target.value }));

  const handleBodyChange = (data: OutputData) =>
    setSubmission((_) => ({
      ..._,
      body: JSON.stringify(data),
    }));

  useEffect(() => {
    if (!isOpen) setSubmission(getInitSubmission(assignmentId, user.id));
  }, [isOpen]);

  return (
    <BaseModal
      isInsideModal
      width="lg"
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      title="Submission"
    >
      <div>
        <Input
          autoFocus
          fullWIdth
          Icon={<LessonsIcon size="xs" />}
          placeholder="Submission name"
          name="title"
          onChange={handleInputChange}
          value={submission.title}
        />
        <p>Description</p>
        <div className="min-h-[298px]">
          <Editor
            height="md"
            onChange={handleBodyChange}
            data={JSON.parse(submission.body)}
            id="submission-editor"
          />
        </div>

        <div className="flex gap-3 items-center mt-3 justify-end">
          <button
            disabled={!submission.title}
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

export default CreateSubmissionModal;
