import Courses from "@/components/courses";
import type { Locale } from "@/i18n";
import { createClient } from "@/utils/supabase/server";
import type { NextPage } from "next";
import { getTranslations } from "next-intl/server";

interface IProps {
  params: { locale: Locale };
}

const Page: NextPage<IProps> = async ({ params: { locale } }) => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  const t = await getTranslations({ locale });

  return (
    <div className="h-full flex flex-col">
      <div>
        <p className="page-title">{t("profile")}</p>
      </div>
      <p className="text-neutral-500">View and manage courses</p>
      <hr className="my-2 mb-4" />
      <Courses user={user} />
    </div>
  );
};

export default Page;
