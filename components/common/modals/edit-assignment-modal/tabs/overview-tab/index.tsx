import BasicInput from "@/components/common/inputs/basic-input";
import DateInput from "@/components/common/inputs/date-input";
import CreateSubmissionModal from "@/components/common/modals/create-submission-modal";
import LessonsIcon from "@/components/icons/lessons-icon";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import LoadingSkeleton from "@/components/utilities/skeletons/loading-skeleton";
import { getAssignment, updateAssignment } from "@/db/client/assignment";
import { useUser } from "@/hooks/use-user";
import type { ResultOf } from "@/types/utils.type";
import clsx from "clsx";
import { format, isAfter } from "date-fns";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import type { ChangeEvent, FunctionComponent } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Editor = dynamic(() => import("@/components/common/editor"), {
  ssr: false,
});

interface Props {
  assignmentId: string;
  onSubmissionCreated?: () => void;
  onAssignmentUpdated: () => void;
}

const OverviewTab: FunctionComponent<Props> = ({
  assignmentId,
  onAssignmentUpdated,
  onSubmissionCreated,
}) => {
  // Hooks
  const t = useTranslations();
  const user = useUser((state) => state.user);

  // States
  const [isCreateSubmissionModal, setIsCreateSubmissionModal] = useState(false);

  const [assignment, setAssignment] =
    useState<ResultOf<typeof getAssignment>>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vars
  const isAssignmentPastDue =
    assignment && isAfter(new Date(), new Date(assignment.due_date));

  // Handlers
  const fetchAssignment = async () => {
    try {
      setAssignment(await getAssignment(assignmentId));
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const submitUpdateAssignment = async () => {
    setIsSubmitting(true);
    try {
      await updateAssignment({
        id: assignment.id,
        body: assignment.body,
        title: assignment.title,
        due_date: assignment.due_date,
      });

      onAssignmentUpdated();

      toast.success(t("success.assignment_updated"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChangeDate = (date: Date) => {
    setAssignment((_assignment) => ({
      ..._assignment,
      due_date: format(date, "yyyy-MM-dd'T'HH:mm:ss"),
    }));
  };
  const onCreateSubmissionModalClose = (mutated?: boolean) => {
    setIsCreateSubmissionModal(false);

    if (mutated) {
      onSubmissionCreated?.();
    }
  };
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAssignment((_) => ({
      ..._,
      [e.target.name]: e.target.value,
    }));
  };

  // Effect
  useEffect(() => {
    fetchAssignment();
  }, []);

  // View
  return (
    <div>
      {assignment ? (
        <div>
          <BasicInput
            disabled={user.role !== "teacher"}
            fullWidth
            StartIcon={<LessonsIcon size="xs" />}
            placeholder={t("labels.assignment_name")}
            name="title"
            value={assignment.title}
            onChange={onInputChange}
          />
          <p>{t("labels.description")}</p>
          <div className="min-h-[216px]">
            {/* !Reason */}
            <Editor
              id="assignment-editor"
              height="sm"
              onChange={(data) =>
                setAssignment((_) => ({ ..._, body: JSON.stringify(data) }))
              }
              data={JSON.parse(assignment.body)}
              readOnly={user.role !== "teacher"}
            />
          </div>

          <div
            className={`flex gap-[14px] items-center mt-[14px] ${isAssignmentPastDue ? "justify-between" : "justify-end"}`}
          >
            <p className="text-sm font-bold text-red-600">
              {isAssignmentPastDue && "This assignment is past due"}
            </p>
            <div className="pr-[12px] border-r-2 border-gray-200">
              <DateInput
                date={new Date(assignment.due_date)}
                onChange={onChangeDate}
                label={t("labels.due_date")}
                popperPlacement="top-start"
                disabled={user.role !== "teacher"}
              />
            </div>
            {user.role === "teacher" ? (
              <button
                className="primary-button"
                onClick={submitUpdateAssignment}
              >
                {isSubmitting && <LoadingSpinner />}
                <span className={`${clsx(isSubmitting && "opacity-0")}`}>
                  {t("buttons.save")}
                </span>
              </button>
            ) : (
              <button
                disabled={isAssignmentPastDue}
                className="primary-button"
                onClick={() => setIsCreateSubmissionModal(true)}
              >
                {t("buttons.create_submission")}
              </button>
            )}
          </div>
          {user.role !== "teacher" && isCreateSubmissionModal && (
            <CreateSubmissionModal
              onClose={onCreateSubmissionModalClose}
              assignmentId={assignment.id}
            />
          )}
        </div>
      ) : (
        <LoadingSkeleton />
      )}
    </div>
  );
};
export default OverviewTab;
