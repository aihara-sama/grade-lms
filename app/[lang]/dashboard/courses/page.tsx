import Courses from "@/components/courses";
import type { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Courses",
};

const Page: NextPage = () => <Courses />;

export default Page;
