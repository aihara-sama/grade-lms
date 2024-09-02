import Profile from "@/components/profile";
import { createClient } from "@/utils/supabase/server";
import type { NextPage } from "next";

interface Props {}
const Page: NextPage<Props> = async () => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return <Profile user={user} />;
};

export default Page;
