import { redirect } from "next/navigation";
import { type FunctionComponent } from "react";

interface Props {
  params: {
    lessonId: string;
    courseId: string;
  };
}
const Page: FunctionComponent<Props> = ({ params: { lessonId, courseId } }) => {
  return redirect(
    `/dashboard/courses/${courseId}/lessons/${lessonId}/overview`
  );
};

export default Page;
