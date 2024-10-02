import Courses from "@/components/courses";
import { getCourses } from "@/db/server/course";
import type { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Courses",
};

const Page: NextPage = async () => {
  const courses = await getCourses();

  return <Courses courses={courses} />;
};

export default Page;
