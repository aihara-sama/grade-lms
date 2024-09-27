import BaseModal from "@/components/common/modals/base-modal";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import Skeleton from "@/components/skeleton";
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

const Editor = dynamic(() => import("@/components/editor"), {
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
  const [isSubmitting, setIsSUbmitting] = useState(false);

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
    setIsSUbmitting(true);
    try {
      await updateSubmission({
        body: submission.body,
        title: submission.title,
        id: submission.id,
      });

      onClose(true);
      toast.success(t("submission_updated"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSUbmitting(false);
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
    <BaseModal
      isInsideModal
      width="lg"
      onClose={() => onClose()}
      title="Submission"
    >
      {submission ? (
        <div>
          <Input
            fullWidth
            StartIcon={<LessonsIcon size="xs" />}
            placeholder="Submission name"
            name="title"
            value={submission.title}
            onChange={onInputChange}
            disabled={isAssignmentPastDue}
          />
          <p>Description</p>
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
              {isSubmitting && (
                <img
                  className="loading-spinner"
                  src="/assets/gifs/loading-spinner.gif"
                  alt=""
                />
              )}
              <span className={`${clsx(isSubmitting && "opacity-0")}`}>
                Save
              </span>
            </button>
          </div>
        </div>
      ) : (
        <Skeleton />
      )}
    </BaseModal>
  );
};

export default EditSubmissionModal;
