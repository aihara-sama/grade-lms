"use client";

import CourseHeader from "@/components/course/course-header";
import CourseSettings from "@/components/course/course-settings";
import type { Database } from "@/types/supabase.type";
import { db } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FunctionComponent } from "react";

interface IProps {
  params: {
    courseId: string;
  };
}
const Page: FunctionComponent<IProps> = ({ params }) => {
  const router = useRouter();
  const [course, setCourse] =
    useState<Database["public"]["Tables"]["courses"]["Row"]>();

  useEffect(() => {
    (async () => {
      const { data, error } = await db
        .from("courses")
        .select("*")
        .eq("id", params.courseId)
        .single();

      if (error) {
        router.push("/dashboard/courses");
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
