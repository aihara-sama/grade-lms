import CreateSubmissionModal from "@/components/common/modals/create-submission-modal";
import DateInput from "@/components/date-input";
import Editor from "@/components/editor";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import Skeleton from "@/components/skeleton";
import { getAssignment, updateAssignment } from "@/db/client/assignment";
import { useUser } from "@/hooks/use-user";
import type { ResultOf } from "@/types/utils.type";
import clsx from "clsx";
import { format, isAfter } from "date-fns";
import { useTranslations } from "next-intl";
import type { ChangeEvent, FunctionComponent } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

      toast(t("success.assignment_updated"));
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

  return (
    <div>
      {assignment ? (
        <div>
          <Input
            disabled={user.role !== "Teacher"}
            fullWidth
            StartIcon={<LessonsIcon size="xs" />}
            placeholder="Assignment name"
            name="title"
            value={assignment.title}
            onChange={onInputChange}
          />
          <p>Description</p>
          <div className="min-h-[216px]">
            <Editor
              id="assignment-editor"
              height="sm"
              onChange={(data) =>
                setAssignment((_) => ({ ..._, body: JSON.stringify(data) }))
              }
              data={JSON.parse(assignment.body)}
              readOnly={user.role !== "Teacher"}
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
                label="Due date"
                popperPlacement="top-start"
                disabled={user.role !== "Teacher"}
              />
            </div>
            {user.role === "Teacher" ? (
              <button
                className="primary-button"
                onClick={submitUpdateAssignment}
              >
                {isSubmitting && (
                  <img
                    className="loading-spinner"
                    src="/assets/gif/loading-spinner.gif"
                    alt=""
                  />
                )}
                <span className={`${clsx(isSubmitting && "opacity-0")}`}>
                  Save
                </span>
              </button>
            ) : (
              <button
                disabled={isAssignmentPastDue}
                className="primary-button"
                onClick={() => setIsCreateSubmissionModal(true)}
              >
                Create submission
              </button>
            )}
          </div>
          {user.role !== "Teacher" && isCreateSubmissionModal && (
            <CreateSubmissionModal
              onClose={onCreateSubmissionModalClose}
              assignmentId={assignment.id}
            />
          )}
        </div>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};
export default OverviewTab;
