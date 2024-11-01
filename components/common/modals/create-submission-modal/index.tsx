import BasicInput from "@/components/common/inputs/basic-input";
import BasicModal from "@/components/common/modals/basic-modal";
import LessonsIcon from "@/components/icons/lessons-icon";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import { createSubmission } from "@/db/client/submission";
import { useUser } from "@/hooks/use-user";
import type { TablesInsert } from "@/types/supabase.type";
import type { OutputData } from "@editorjs/editorjs";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import type { ChangeEvent, FunctionComponent } from "react";
import { useState } from "react";

import toast from "react-hot-toast";

const Editor = dynamic(() => import("@/components/common/editor"), {
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
  const user = useUser((state) => state.user);

  // States
  const [submission, setSubmission] = useState<TablesInsert<"submissions">>({
    user_id: user.id,
    title: "My Submission",
    body: "{}",
    assignment_id: assignmentId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const submitCreateAssignment = async () => {
    setIsSubmitting(true);

    try {
      await createSubmission(submission);

      toast.success(t("success.submission_created"));
      onClose(true);
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

  // View
  return (
    <BasicModal
      isInsideModal
      width="lg"
      onClose={() => onClose()}
      title={t("modal.titles.create_submission.title")}
    >
      <div>
        <BasicInput
          autoFocus
          fullWidth
          StartIcon={<LessonsIcon size="xs" />}
          placeholder={t("placeholders.submission_name")}
          name="title"
          onChange={onInputChange}
          value={submission.title}
        />
        <p>{t("labels.description")}</p>
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
            {isSubmitting && <LoadingSpinner />}
            <span className={`${clsx(isSubmitting && "opacity-0")}`}>
              {t("buttons.create")}
            </span>
          </button>
        </div>
      </div>
    </BasicModal>
  );
};
export default CreateSubmissionModal;
