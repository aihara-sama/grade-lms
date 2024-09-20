import BaseModal from "@/components/common/modals/base-modal";
import DateInput from "@/components/date-input";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import { createAssignment } from "@/db/assignment";
import { Event } from "@/enums/event.enum";
import { useNotificationChannel } from "@/hooks/use-notification-channel";
import type { TablesInsert } from "@/types/supabase.type";
import { getNextMorning } from "@/utils/date/get-next-morning";
import type { OutputData } from "@editorjs/editorjs";
import clsx from "clsx";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import type { ChangeEvent, FunctionComponent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface Props {
  onClose: (mutated?: boolean) => void;
  lessonId: string;
}

const CreateAssignmentModal: FunctionComponent<Props> = ({
  lessonId,
  onClose,
}) => {
  // States
  const [assignment, setAssignment] = useState<TablesInsert<"assignments">>({
    lesson_id: lessonId,
    title: "",
    body: "{}",
    due_date: getNextMorning().toISOString(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks
  const t = useTranslations();
  const notificationChannel = useNotificationChannel();

  // Handlers
  const submitCreateAssignment = async () => {
    setIsSubmitting(true);
    try {
      await createAssignment(assignment);

      notificationChannel.send({
        event: Event.NotificationCreated,
        type: "broadcast",
      });

      toast.success(t("assignment_created"));
      onClose(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
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

  return (
    <BaseModal width="lg" onClose={() => onClose()} title="Create assignment">
      <div>
        <Input
          autoFocus
          fullWidth
          StartIcon={<LessonsIcon size="xs" />}
          placeholder="Assignment name"
          name="title"
          onChange={onInputChange}
          value={assignment.title}
        />
        <p>Description</p>
        <div className="min-h-[274px]">
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
            {isSubmitting && (
              <img
                className="loading-spinner"
                src="/assets/gifs/loading-spinner.gif"
                alt=""
              />
            )}
            <span className={`${clsx(isSubmitting && "opacity-0")}`}>
              Create
            </span>
          </button>
        </div>
      </div>
    </BaseModal>
  );
};
export default CreateAssignmentModal;
