"use client";

import { revalidatePageAction } from "@/actions/revalidate-page-action";
import Container from "@/components/container";
import CourseHeader from "@/components/course/course-header";
import CoursesIcon from "@/components/icons/courses-icon";
import Input from "@/components/input";
import LoadingSpinner from "@/components/loading-spinner";
import { updateCourse } from "@/db/client/course";
import type { Course } from "@/types/course.type";
import clsx from "clsx";
import { useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  course: Course;
}

const CourseSettings: FunctionComponent<Props> = ({ course: initCourse }) => {
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
      <CourseHeader course={course} />
      <p className="section-title">Settings</p>
      <div>
        <div className="flex items-end gap-[4px]">
          <Input
            label="Course name"
            StartIcon={<CoursesIcon size="xs" />}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-auto"
          />
          <button
            disabled={!title || isSubmitting}
            className="primary-button w-[100px]"
            onClick={submitUpdateCourse}
          >
            {isSubmitting && <LoadingSpinner />}
            <span className={`${clsx(isSubmitting && "opacity-0")}`}>Save</span>
          </button>
        </div>
      </div>
    </Container>
  );
};

export default CourseSettings;
