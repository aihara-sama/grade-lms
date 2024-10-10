import BasicInput from "@/components/common/inputs/basic-input";
import BasicModal from "@/components/common/modals/basic-modal";
import LessonsIcon from "@/components/icons/lessons-icon";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import LoadingSkeleton from "@/components/utilities/skeletons/loading-skeleton";
import { getSubmission, updateSubmission } from "@/db/client/submission";
import type { ResultOf } from "@/types/utils.type";
import type { OutputData } from "@editorjs/editorjs";
import clsx from "clsx";
import { isAfter } from "date-fns";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import type { ChangeEvent, FunctionComponent } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Editor = dynamic(() => import("@/components/common/editor"), {
  ssr: false,
});
interface Props {
  onClose: (mutated?: boolean) => void;
  submissionId: string;
}
const EditSubmissionModal: FunctionComponent<Props> = ({
  submissionId,
  onClose,
}) => {
  const [submission, setSubmission] =
    useState<ResultOf<typeof getSubmission>>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useTranslations();

  const isAssignmentPastDue =
    submission && isAfter(new Date(), new Date(submission.assignment.due_date));

  const fetchSubmission = async () => {
    try {
      const submissionData = await getSubmission(submissionId);
      setSubmission(submissionData);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitUpdateSubmission = async () => {
    console.log("submitUpdateSubmission");

    setIsSubmitting(true);
    try {
      await updateSubmission({
        body: submission.body,
        title: submission.title,
        id: submission.id,
      });

      onClose(true);
      toast.success(t("success.submission_updated"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onBodyChange = (data: OutputData) =>
    setSubmission((_) => ({
      ..._,
      body: JSON.stringify(data),
    }));
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSubmission((_) => ({ ..._, [e.target.name]: e.target.value }));

  useEffect(() => {
    fetchSubmission();
  }, []);

  return (
    <BasicModal
      isInsideModal
      width="lg"
      onClose={() => onClose()}
      title={t("modal.titles.edit_submission.title")}
    >
      {submission ? (
        <div>
          <BasicInput
            fullWidth
            StartIcon={<LessonsIcon size="xs" />}
            placeholder={t("placeholders.submission_name")}
            name="title"
            value={submission.title}
            onChange={onInputChange}
            disabled={isAssignmentPastDue}
          />
          <p>{t("labels.description")}</p>
          <div className="">
            <Editor
              height="lg"
              id="submission-editor"
              onChange={onBodyChange}
              data={JSON.parse(submission.body)}
              readOnly={isAssignmentPastDue}
            />
          </div>
          <div className="flex gap-3 items-center mt-3 justify-between">
            <p className="text-sm font-bold text-red-600">
              {isAssignmentPastDue && "This assignment is past due"}
            </p>
            <button
              onClick={submitUpdateSubmission}
              disabled={
                !submission.title ||
                !(JSON.parse(submission.body) as OutputData)?.blocks?.length
              }
              className="primary-button w-[100px]"
            >
              {isSubmitting && <LoadingSpinner />}
              <span className={`${clsx(isSubmitting && "opacity-0")}`}>
                {t("buttons.save")}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <LoadingSkeleton />
      )}
    </BasicModal>
  );
};

export default EditSubmissionModal;
