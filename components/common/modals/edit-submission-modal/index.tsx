import BaseModal from "@/components/common/modals/base-modal";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import Skeleton from "@/components/skeleton";
import {
  getSubmissionWithAuthorBySubmissionId,
  updateSubmission,
} from "@/db/submission";
import type { SubmissionWithAuthor } from "@/types/submissions.type";
import type { OutputData } from "@editorjs/editorjs";
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
interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  submissionId: string;
  onDone: () => void;
  isAssignmentPastDue: boolean;
}
const EditSubmissionModal: FunctionComponent<IProps> = ({
  isOpen,
  setIsOpen,
  submissionId,
  isAssignmentPastDue,
  onDone,
}) => {
  const [submission, setSubmission] = useState<SubmissionWithAuthor>();

  const t = useTranslations();

  const submitUpdateSubmission = async () => {
    try {
      await updateSubmission(submission);

      toast.success(t("submission_updated"));
      setIsOpen(false);
      onDone();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const fetchSubmission = async () => {
    try {
      const submissionData =
        await getSubmissionWithAuthorBySubmissionId(submissionId);
      setSubmission(submissionData);
    } catch (error: any) {
      toast.error(error.message);
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
    if (isOpen) fetchSubmission();
  }, [isOpen]);

  return (
    <BaseModal
      isInsideModal
      width="lg"
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      title="Submission"
    >
      {submission ? (
        <div>
          <Input
            fullWIdth
            Icon={<LessonsIcon size="xs" />}
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
              Submit
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
