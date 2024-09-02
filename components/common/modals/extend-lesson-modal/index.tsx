import BaseModal from "@/components/common/modals/base-modal";
import TimeIcon from "@/components/icons/time-icon";
import Input from "@/components/input";
import { extendLesson, getOverlappingLessons } from "@/db/lesson";
import { useUser } from "@/hooks/use-user";
import type { Lesson } from "@/types/lessons.type";
import { format, minutesToMilliseconds } from "date-fns";
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

  const t = useTranslations();
  const { user } = useUser();

  // Handlers
  const submitExtendLesson = async () => {
    try {
      const overlappingLessons = await getOverlappingLessons(
        lesson.starts,
        format(
          +new Date(lesson.ends) + minutesToMilliseconds(extendLessonByMin),
          "yyyy-MM-dd'T'HH:mm:ss"
        ),
        user.id
      );

      if (overlappingLessons.length) throw new Error(t("lesson_overlaps"));

      await extendLesson(lesson, minutesToMilliseconds(extendLessonByMin));

      onClose(true);
      toast(t("lesson_extended"));
    } catch (error: any) {
      toast.error(error.message);
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
    <BaseModal isExpanded={false} title="Extend lesson" onClose={onClose}>
      <div>
        <div>
          <Input
            value={`${extendLessonByMin}`}
            onChange={onExtendLessonInputChange}
            autoFocus
            fullWIdth
            Icon={<TimeIcon />}
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
            Save
          </button>
        </div>
      </div>
    </BaseModal>
  );
};
export default ExtendLessonModal;
