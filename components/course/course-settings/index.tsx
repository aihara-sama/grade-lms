"use client";

import CoursesIcon from "@/components/icons/courses-icon";
import Input from "@/components/input";
import type { Database } from "@/types/supabase.type";
import { db } from "@/utils/supabase/client";
// import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  course: Database["public"]["Tables"]["courses"]["Row"];
  updateCourseTitle: (title: string) => void;
}

const CourseSettings: FunctionComponent<Props> = ({
  course,
  updateCourseTitle,
}) => {
  const router = useRouter();
  const [courseTitle, setCourseTitle] = useState(course.title);
  const handleRenameCourse = async () => {
    const { error } = await db
      .from("courses")
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
      // revalidatePath(`/dashboard/courses/${course.id}/overview`);
    }
  };

  return (
    <div>
      <p className="section-title">Settings</p>
      <div>
        <div className="flex items-end gap-[4px]">
          <Input
            label="Course name"
            Icon={<CoursesIcon size="xs" />}
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="mb-auto"
          />
          <button
            disabled={!courseTitle}
            className="primary-button w-[100px]"
            onClick={handleRenameCourse}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseSettings;
