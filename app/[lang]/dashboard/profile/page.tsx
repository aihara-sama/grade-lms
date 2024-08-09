import Profile from "@/components/profile";
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

  return <Profile dictionary={dictionary} user={user} />;
};

export default Page;
