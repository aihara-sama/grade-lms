import Courses from "@/components/courses";
import type { Metadata, NextPage } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Courses",
};

const Page: NextPage = async () => {
  const t = await getTranslations();

  return (
    <div className="h-full flex flex-col">
      <p className="text-3xl font-bold text-neutral-600">{t("courses")}</p>
      <p className="text-neutral-500">View and manage courses</p>
      <hr className="my-2 mb-4" />
      <Courses />
    </div>
  );
};

export default Page;
