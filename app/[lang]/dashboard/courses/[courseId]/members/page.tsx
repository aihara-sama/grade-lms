import Members from "@/components/course/members";
import { getCourse } from "@/db/server/course";

import { type FunctionComponent } from "react";

interface Props {
  params: { courseId: string };
}

const Page: FunctionComponent<Props> = async ({ params: { courseId } }) => {
  const course = await getCourse(courseId);

  return <Members course={course} />;
};
export default Page;
