"use client";

import { revalidatePageAction } from "@/actions/revalidate-page-action";
import Header from "@/app/[lang]/dashboard/courses/[courseId]/components/header";
import BasicInput from "@/components/common/inputs/basic-input";
import CoursesIcon from "@/components/icons/courses-icon";
import Container from "@/components/layout/container";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import { updateCourse } from "@/db/client/course";
import type { Course } from "@/types/course.type";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  course: Course;
}

const CourseSettings: FunctionComponent<Props> = ({ course: initCourse }) => {
  // Hooks
  const t = useTranslations();

  // State
  const [course, setCourse] = useState(initCourse);
  const [title, setTitle] = useState(initCourse.title);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const submitUpdateCourse = async () => {
    setIsSubmitting(true);

    try {
      await updateCourse({ id: course.id, title });
      setCourse({ ...initCourse, title });

      revalidatePageAction();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // View
  return (
    <Container>
      <Header course={course} />
      <p className="section-title">{t("common.settings")}</p>
      <div>
        <div className="flex items-end gap-[4px]">
          <BasicInput
            label={t("labels.course_name")}
            StartIcon={<CoursesIcon size="xs" />}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-auto"
          />
          <button
            disabled={!title || isSubmitting || course.title === title}
            className="primary-button w-[100px]"
            onClick={submitUpdateCourse}
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

export default CourseSettings;
