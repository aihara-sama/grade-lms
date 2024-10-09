import Members from "@/app/[lang]/dashboard/courses/[courseId]/members/components/members";
import { getCourse } from "@/db/server/course";
import { getMembers } from "@/db/server/user";

import { type FunctionComponent } from "react";

interface Props {
  params: { courseId: string };
}

const Page: FunctionComponent<Props> = async ({ params: { courseId } }) => {
  const [course, users] = await Promise.all([
    getCourse(courseId),
    getMembers(courseId),
  ]);

  return <Members course={course} users={users} />;
};
export default Page;
