import BaseModal from "@/components/common/modals/base-modal";
import TimeIcon from "@/components/icons/time-icon";
import Input from "@/components/input";
import { extendLesson, getOverlappingLessons } from "@/db/lesson";
import { useLesson } from "@/hooks/use-lesson";
import { useUser } from "@/hooks/use-user";
import type { Lesson } from "@/types/lesson.type";
import clsx from "clsx";
import { minutesToMilliseconds } from "date-fns";
import { useTranslations } from "next-intl";
import type { ChangeEvent, FunctionComponent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  onClose: (mutated?: boolean) => void;
  lesson: Lesson;
}

const ExtendLessonModal: FunctionComponent<Props> = ({ lesson, onClose }) => {
  // State
  const [extendLessonByMin, setExtendLessonByMin] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useTranslations();
  const { user } = useUser();
  const { setLesson } = useLesson();

  // Handlers
  const submitExtendLesson = async () => {
    setIsSubmitting(true);

    try {
      // Dont check for quick lessons
      if (lesson.course_id) {
        const overlappingLessons = await getOverlappingLessons(
          lesson.starts,
          new Date(
            +new Date(lesson.ends) + minutesToMilliseconds(extendLessonByMin)
          ).toISOString(),
          user.id,
          lesson.id
        );

        if (overlappingLessons.length) throw new Error(t("lesson_overlaps"));
      }

      setLesson(
        await extendLesson(lesson, minutesToMilliseconds(extendLessonByMin))
      );

      onClose(true);
      toast.success(t("lesson_extended"));
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
      isExpanded={false}
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
            startIcon={<TimeIcon />}
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
            {isSubmitting && (
              <img
                className="loading-spinner"
                src="/gifs/loading-spinner.gif"
                alt=""
              />
            )}
            <span className={`${clsx(isSubmitting && "opacity-0")}`}>Save</span>
          </button>
        </div>
      </div>
    </BaseModal>
  );
};
export default ExtendLessonModal;
