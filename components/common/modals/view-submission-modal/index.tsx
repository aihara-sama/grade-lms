import IconTitle from "@/components/common/icon-title";
import BasicInput from "@/components/common/inputs/basic-input";
import BasicModal from "@/components/common/modals/basic-modal";
import AvatarIcon from "@/components/icons/avatar-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import StarIcon from "@/components/icons/star-icon";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import LoadingSkeleton from "@/components/utilities/skeletons/loading-skeleton";
import { upsertGrade } from "@/db/client/grade";
import { getSubmission } from "@/db/client/submission";
import type { ResultOf } from "@/types/utils.type";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Editor = dynamic(() => import("@/components/common/editor"), {
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
  const [grade, setGrade] = useState<string>();
  const [submission, setSubmission] =
    useState<ResultOf<typeof getSubmission>>();
  const [hoveredGrade, setHoveredGrade] = useState<number>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useTranslations();

  const submitUpdateGrade = async () => {
    setIsSubmitting(true);
    try {
      await upsertGrade({
        id: submission.grades?.[0]?.id,
        title: `${grade}`,
        submissions_id: submission.id,
      });

      onClose(true);
      toast.success(t("success.grade_updated"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchSubmission = async () => {
    try {
      const submissionData = await getSubmission(submissionId);
      setSubmission(submissionData);
      setGrade(submissionData.grades?.[0]?.title);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchSubmission();
  }, []);

  return (
    <BasicModal
      isInsideModal
      width="lg"
      onClose={() => onClose()}
      title={t("modal.titles.view_submission.title")}
    >
      {!submission ? (
        <LoadingSkeleton className="" />
      ) : (
        <div>
          <BasicInput
            disabled
            fullWidth
            StartIcon={<LessonsIcon size="xs" />}
            placeholder={t("placeholders.submission_name")}
            name="title"
            value={submission.title}
          />
          <p>{t("labels.description")}</p>
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
                subtitle={t(`roles.${submission.author.user_settings.role}`)}
              />
            </div>
            <div className="flex gap-2 items-center text-neutral-500">
              {[...new Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex"
                  onClick={() => setGrade(`${idx + 1}`)}
                  onMouseEnter={() => setHoveredGrade(idx + 1)}
                  onMouseLeave={() => setHoveredGrade(undefined)}
                >
                  <StarIcon
                    className={`hover:text-amber-400 cursor-pointer ${idx + 1 <= hoveredGrade || idx + 1 <= +grade ? "text-amber-400" : ""} `}
                    key={idx}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={submitUpdateGrade}
              disabled={submission.grades?.[0]?.title === grade}
              className="primary-button w-[100px]"
            >
              {isSubmitting && <LoadingSpinner />}
              <span className={`${clsx(isSubmitting && "opacity-0")}`}>
                {t("buttons.submit")}
              </span>
            </button>
          </div>
        </div>
      )}
    </BasicModal>
  );
};
export default ViewSubmissionModal;
