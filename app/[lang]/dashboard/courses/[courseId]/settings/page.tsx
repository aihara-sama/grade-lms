import CourseSettings from "@/components/course/course-settings";
import { getCourse } from "@/db/server/course";
import { type FunctionComponent } from "react";

interface Props {
  params: {
    courseId: string;
  };
}
const Page: FunctionComponent<Props> = async ({ params: { courseId } }) => {
  const course = await getCourse(courseId);

  return <CourseSettings course={course} />;
};

export default Page;
