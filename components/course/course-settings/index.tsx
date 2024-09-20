"use client";

import CoursesIcon from "@/components/icons/courses-icon";
import Input from "@/components/input";
import { DB } from "@/lib/supabase/db/browser-db";
import type { Course } from "@/types/course.type";
import clsx from "clsx";
// import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  course: Course;
  updateCourseTitle: (title: string) => void;
}

const CourseSettings: FunctionComponent<Props> = ({
  course,
  updateCourseTitle,
}) => {
  const router = useRouter();
  const [courseTitle, setCourseTitle] = useState(course.title);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRenameCourse = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await DB.from("courses")
        .update({
          title: courseTitle,
        })
        .eq("id", course.id);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Saved!");
        updateCourseTitle(courseTitle);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <p className="section-title">Settings</p>
      <div>
        <div className="flex items-end gap-[4px]">
          <Input
            label="Course name"
            startIcon={<CoursesIcon size="xs" />}
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="mb-auto"
          />
          <button
            disabled={!courseTitle || isSubmitting}
            className="primary-button w-[100px]"
            onClick={handleRenameCourse}
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
    </div>
  );
};

export default CourseSettings;
