import { redirect } from "next/navigation";
import { type FunctionComponent } from "react";

interface IProps {
  params: {
    lessonId: string;
    courseId: string;
  };
}
const Page: FunctionComponent<IProps> = async ({
  params: { lessonId, courseId },
}) => {
  return redirect(
    `/dashboard/courses/${courseId}/lessons/${lessonId}/overview`
  );
};

export default Page;
