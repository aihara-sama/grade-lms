import Courses from "@/components/courses";
import type { Locale } from "@/i18n-config";
import { getDictionary } from "@/utils/get-dictionary";
import { createClient } from "@/utils/supabase/server";
import type { NextPage } from "next";

interface IProps {
  params: { lang: Locale };
}

const Page: NextPage<IProps> = async ({ params: { lang } }) => {
  const dictionary = await getDictionary(lang);
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <div>
      <p className="page-title">{dictionary["server-component"].courses}</p>
      <p className="text-neutral-500">View and manage courses</p>
      <hr className="my-2 mb-4" />
      <Courses dictionary={dictionary} user={user} />
    </div>
  );
};

export default Page;
