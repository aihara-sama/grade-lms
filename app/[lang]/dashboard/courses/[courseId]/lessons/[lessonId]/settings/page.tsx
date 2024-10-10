"use client";

import Header from "@/app/[lang]/dashboard/lessons/[lessonId]/components/live-lesson/header";
import BasicInput from "@/components/common/inputs/basic-input";
import CoursesIcon from "@/components/icons/courses-icon";
import Container from "@/components/layout/container";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import { updateLesson } from "@/db/client/lesson";
import { useLesson } from "@/hooks/use-lesson";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

const Page: FunctionComponent = () => {
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
      <Header course={lesson.course} />
      <p className="section-title">{t("common.settings")}</p>
      <div className="rename-wrapper">
        <div className="flex gap-1 items-end">
          <BasicInput
            onChange={(e) => setTitle(e.target.value)}
            label={t("labels.lesson_name")}
            StartIcon={<CoursesIcon size="xs" />}
            value={title}
            className="mb-auto"
          />
          <button
            disabled={!title || isSubmitting || lesson.title === title}
            className="primary-button w-24"
            onClick={submitUpdateLesson}
          >
            {isSubmitting && <LoadingSpinner />}
            <span className={`${clsx(isSubmitting && "opacity-0")}`}>
              {t("buttons.save")}
            </span>
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Page;
