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
  onDone: () => void;
  submissionId: string;
}
const EditSubmissionModal: FunctionComponent<IProps> = ({
  onDone,
  submissionId,
  isOpen,
  setIsOpen,
}) => {
  const [submission, setSubmission] = useState<SubmissionWithAuthor>();

  const t = useTranslations();

  const handleUpdateSubmission = async () => {
    try {
      await updateSubmission(submission);

      toast.success(t("submission_updated"));
      setIsOpen(false);
      onDone();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getSubmission = async () => {
    try {
      const submissionData =
        await getSubmissionWithAuthorBySubmissionId(submissionId);
      setSubmission(submissionData);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const handleBodyChange = (data: OutputData) =>
    setSubmission((_) => ({
      ..._,
      body: JSON.stringify(data),
    }));
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSubmission((_) => ({ ..._, [e.target.name]: e.target.value }));

  useEffect(() => {
    if (isOpen) getSubmission();
  }, [isOpen]);

  return (
    <BaseModal
      isInsideModal
      width="lg"
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      title="Submission"
    >
      {!submission ? (
        <Skeleton className="" />
      ) : (
        <div>
          <Input
            fullWIdth
            Icon={<LessonsIcon size="xs" />}
            placeholder="Submission name"
            name="title"
            value={submission.title}
            onChange={handleInputChange}
          />
          <p>Description</p>
          <div className="">
            <Editor
              height="lg"
              id="submission-editor"
              onChange={handleBodyChange}
              data={JSON.parse(submission.body)}
            />
          </div>
          <div className="flex gap-3 items-center mt-3 justify-end">
            <button
              onClick={handleUpdateSubmission}
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
      )}
    </BaseModal>
  );
};

export default EditSubmissionModal;
