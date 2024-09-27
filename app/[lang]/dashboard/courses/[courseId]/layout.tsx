import { getCourse } from "@/db/server/course";
import { redirect } from "next/navigation";
import type { FunctionComponent, PropsWithChildren } from "react";

interface Props {
  params: {
    courseId: string;
  };
}

const Layout: FunctionComponent<PropsWithChildren<Props>> = async ({
  params: { courseId },
  children,
}) => {
  const course = await getCourse(courseId);

  if (!course) return redirect("/dashboard");

  return <> {children}</>;
};

export default Layout;
