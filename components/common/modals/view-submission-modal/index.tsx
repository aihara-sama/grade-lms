import BaseModal from "@/components/common/modals/base-modal";
import IconTitle from "@/components/icon-title";
import AvatarIcon from "@/components/icons/avatar-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import StarIcon from "@/components/icons/star-icon";
import Input from "@/components/input";
import Skeleton from "@/components/skeleton";
import { getSubmissionById, updateSubmissionGrade } from "@/db/submission";
import { useUser } from "@/hooks/use-user";
import type { SubmissionWithAuthor } from "@/types/submissions.type";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});
interface Props {
  onClose: (mutated?: boolean) => void;
  submissionId: string;
}
const ViewSubmissionModal: FunctionComponent<Props> = ({
  submissionId,
  onClose,
}) => {
  const [grade, setGrade] = useState<number>();
  const [submission, setSubmission] = useState<SubmissionWithAuthor>();
  const [hoveredGrade, setHoveredGrade] = useState<number>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useTranslations();
  const { user } = useUser();

  const submitUpdateGrade = async () => {
    setIsSubmitting(true);
    try {
      await updateSubmissionGrade(submissionId, grade);

      onClose(true);
      toast.success(t("grade_updated"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchSubmission = async () => {
    try {
      const submissionData = await getSubmissionById(submissionId);
      setSubmission(submissionData);
      setGrade(submissionData.grade);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

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
      {!submission ? (
        <Skeleton className="" />
      ) : (
        <div>
          <Input
            disabled
            fullWIdth
            Icon={<LessonsIcon size="xs" />}
            placeholder="Submission name"
            name="title"
            value={submission.title}
          />
          <p>Description</p>
          <div className="">
            <Editor
              height="md"
              id="submission-editor"
              readOnly
              onChange={() => {}}
              data={JSON.parse(submission.body)}
            />
          </div>
          <div className="flex sm:flex-row flex-col gap-3 items-center mt-3">
            <div className="flex-1">
              <IconTitle
                Icon={<AvatarIcon size="md" />}
                title={submission.author.name}
                subtitle={submission.author.role}
                href={`/${user.preferred_locale}/users/${submission.author.id}`}
              />
            </div>
            <div className="flex gap-2 items-center text-neutral-500">
              {[...new Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex"
                  onClick={() => setGrade(idx + 1)}
                  onMouseEnter={() => setHoveredGrade(idx + 1)}
                  onMouseLeave={() => setHoveredGrade(undefined)}
                >
                  <StarIcon
                    className={`hover:text-amber-400 cursor-pointer ${idx + 1 <= hoveredGrade || idx + 1 <= grade ? "text-amber-400" : ""} `}
                    key={idx}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={submitUpdateGrade}
              disabled={submission.grade === grade}
              className="primary-button w-[100px]"
            >
              {isSubmitting && (
                <img
                  className="loading-spinner"
                  src="/gifs/loading-spinner.gif"
                  alt=""
                />
              )}
              <span className={`${clsx(isSubmitting && "opacity-0")}`}>
                Submit
              </span>
            </button>
          </div>
        </div>
      )}
    </BaseModal>
  );
};
export default ViewSubmissionModal;
