import BaseModal from "@/components/common/modals/base-modal";
import TimeIcon from "@/components/icons/time-icon";
import Input from "@/components/input";
import LoadingSpinner from "@/components/loading-spinner";
import { extendLesson, getOverlappingLessons } from "@/db/client/lesson";
import { useLesson } from "@/hooks/use-lesson";
import clsx from "clsx";
import { minutesToMilliseconds } from "date-fns";
import { useTranslations } from "next-intl";
import type { ChangeEvent, FunctionComponent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  onClose: () => void;
}

const ExtendLessonModal: FunctionComponent<Props> = ({ onClose }) => {
  // State
  const [extendLessonByMin, setExtendLessonByMin] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks
  const lesson = useLesson((state) => state.lesson);

  const t = useTranslations();
  const setLesson = useLesson((state) => state.setLesson);

  // Handlers
  const submitExtendLesson = async () => {
    setIsSubmitting(true);

    try {
      // Dont check for quick lessons
      if (lesson.course_id) {
        const ends = new Date(
          +new Date(lesson.ends) + minutesToMilliseconds(extendLessonByMin)
        ).toISOString();

        const { count } = await getOverlappingLessons(
          lesson.starts,
          ends,
          lesson.id
        );

        if (count) throw new Error(t("error.lesson_overlaps"));
      }

      const data = await extendLesson(
        lesson,
        minutesToMilliseconds(extendLessonByMin)
      );

      setLesson({ ...lesson, ends: data.ends });

      onClose();
      toast.success(t("success.lesson_extended"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onExtendLessonInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const extendBy = +e.target.value;

    if (extendBy > extendLessonByMin) {
      setExtendLessonByMin(extendBy + 14);
    } else if (extendBy < extendLessonByMin && extendBy > 15) {
      setExtendLessonByMin(extendBy - 14);
    }
  };
  // View
  return (
    <BaseModal
      isFixedHeight={false}
      title="Extend lesson"
      onClose={() => onClose()}
    >
      <div>
        <div>
          <Input
            value={`${extendLessonByMin}`}
            onChange={onExtendLessonInputChange}
            autoFocus
            fullWidth
            StartIcon={<TimeIcon />}
            type="number"
            label="Add minutes"
          />
        </div>
        <div className="flex gap-3">
          <button
            className="outline-button ml-auto w-auto"
            onClick={() => onClose()}
          >
            Cancel
          </button>
          <button
            className="primary-button w-auto"
            onClick={submitExtendLesson}
          >
            {isSubmitting && <LoadingSpinner />}
            <span className={`${clsx(isSubmitting && "opacity-0")}`}>Save</span>
          </button>
        </div>
      </div>
    </BaseModal>
  );
};
export default ExtendLessonModal;
