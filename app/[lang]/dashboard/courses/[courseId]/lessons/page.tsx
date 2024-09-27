import Lessons from "@/components/course/lessons";
import { getCourse } from "@/db/server/course";
import type { FunctionComponent } from "react";

interface Props {
  params: { courseId: string };
}

const Page: FunctionComponent<Props> = async ({ params: { courseId } }) => {
  const course = await getCourse(courseId);

  return <Lessons course={course} />;
};
export default Page;
