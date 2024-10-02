"use client";

import Container from "@/components/container";
import CoursesIcon from "@/components/icons/courses-icon";
import Input from "@/components/input";
import LessonHeader from "@/components/live-lesson/lesson-header";
import LoadingSpinner from "@/components/loading-spinner";
import { updateLesson } from "@/db/client/lesson";
import { useLesson } from "@/hooks/use-lesson";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

const LessonSettings: FunctionComponent = () => {
  // Hooks
  const t = useTranslations();
  const lesson = useLesson((state) => state.lesson);

  const setLesson = useLesson((state) => state.setLesson);

  // State
  const [title, setTitle] = useState(lesson.title);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitUpdateLesson = async () => {
    setIsSubmitting(true);

    try {
      await updateLesson({ id: lesson.id, title });
      setLesson({ ...lesson, title });

      toast.success(t("success.lesson_updated"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // View
  return (
    <Container>
      <LessonHeader course={lesson.course} />
      <p className="section-title">Settings</p>
      <div className="rename-wrapper">
        <div className="flex gap-1 items-end">
          <Input
            onChange={(e) => setTitle(e.target.value)}
            label="Lesson name"
            StartIcon={<CoursesIcon size="xs" />}
            value={title}
            className="mb-auto"
          />
          <button
            disabled={!title || isSubmitting}
            className="primary-button w-24"
            onClick={submitUpdateLesson}
          >
            {isSubmitting && <LoadingSpinner />}
            <span className={`${clsx(isSubmitting && "opacity-0")}`}>Save</span>
          </button>
        </div>
      </div>
    </Container>
  );
};
export default LessonSettings;
