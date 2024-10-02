import Assignments from "@/components/assignments";
import { getLessonAssignments } from "@/db/server/assignment";

import { type FunctionComponent } from "react";

interface Props {
  params: { lessonId: string };
}

const Page: FunctionComponent<Props> = async ({ params: { lessonId } }) => {
  const assignments = await getLessonAssignments(lessonId);

  return <Assignments assignments={assignments} />;
};

export default Page;
