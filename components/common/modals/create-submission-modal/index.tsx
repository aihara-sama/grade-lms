import BaseModal from "@/components/common/modals/base-modal";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import { createSubmission } from "@/db/submission";
import { Event } from "@/enums/event.enum";
import { useNotificationChannel } from "@/hooks/use-notification-channel";
import { useUser } from "@/hooks/use-user";
import type { TablesInsert } from "@/types/supabase.type";
import type { OutputData } from "@editorjs/editorjs";
import clsx from "clsx";
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
  assignmentId: string;
}
const CreateSubmissionModal: FunctionComponent<Props> = ({
  onClose,
  assignmentId,
}) => {
  // Hooks
  const t = useTranslations();
  const notificationChannel = useNotificationChannel();
  const { user } = useUser();

  // States
  const [submission, setSubmission] = useState<TablesInsert<"submissions">>({
    user_id: user.id,
    title: "My Submission",
    body: "{}",
    assignment_id: assignmentId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const fireNotificationCreated = () => {
    notificationChannel.send({
      event: Event.NotificationCreated,
      type: "broadcast",
    });
  };
  const submitCreateAssignment = async () => {
    setIsSubmitting(true);

    try {
      await createSubmission(submission);

      fireNotificationCreated();
      toast.success(t("submission_created"));
      onClose(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSubmission((_) => ({ ..._, [e.target.name]: e.target.value }));

  const onBodyChange = (data: OutputData) =>
    setSubmission((_) => ({
      ..._,
      body: JSON.stringify(data),
    }));

  return (
    <BaseModal
      isInsideModal
      width="lg"
      onClose={() => onClose()}
      title="Submission"
    >
      <div>
        <Input
          autoFocus
          fullWidth
          StartIcon={<LessonsIcon size="xs" />}
          placeholder="Submission name"
          name="title"
          onChange={onInputChange}
          value={submission.title}
        />
        <p>Description</p>
        <div className="min-h-[274px]">
          <Editor
            height="md"
            onChange={onBodyChange}
            data={JSON.parse(submission.body)}
            id="submission-editor"
          />
        </div>

        <div className="flex gap-3 items-center mt-[14px] justify-end">
          <button
            disabled={!submission.title}
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
export default CreateSubmissionModal;
