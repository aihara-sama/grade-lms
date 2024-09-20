"use client";

import CourseHeader from "@/components/course/course-header";
import CourseSettings from "@/components/course/course-settings";
import { DB } from "@/lib/supabase/db";
import type { Course } from "@/types/course.type";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FunctionComponent } from "react";

interface Props {
  params: {
    courseId: string;
  };
}
const Page: FunctionComponent<Props> = ({ params }) => {
  const [course, setCourse] = useState<Course>();

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data, error } = await DB.from("courses")
        .select("*")
        .eq("id", params.courseId)
        .single();

      if (error) {
        router.push(`/dashboard/courses`);
      } else {
        setCourse(data);
      }
    })();
  }, []);

  // if (error) return redirect("/dashboard/courses");

  return (
    <div>
      {course && (
        <>
          <CourseHeader course={course} />
          <CourseSettings
            updateCourseTitle={(title) =>
              setCourse((prev) => ({ ...prev, title }))
            }
            course={course}
          />
        </>
      )}
    </div>
  );
};

export default Page;
