import Courses from "@/components/courses";
import type { Locale } from "@/i18n";
import type { Metadata, NextPage } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Courses",
};

interface IProps {
  params: { locale: Locale };
}

const Page: NextPage<IProps> = async ({ params: { locale } }) => {
  const t = await getTranslations({ locale });

  return (
    <div className="h-full flex flex-col">
      <div>
        <p className="text-3xl font-bold text-neutral-600">{t("courses")}</p>
      </div>
      <p className="text-neutral-500">View and manage courses</p>
      <hr className="my-2 mb-4" />
      <Courses />
    </div>
  );
};

export default Page;
