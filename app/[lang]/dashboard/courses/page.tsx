import Courses from "@/components/courses";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import type { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Courses",
};

const Page: NextPage = async () => {
  const {
    data: { user },
  } = await getServerDB().auth.getUser();

  return <Courses view={user.user_metadata.role} />;
};

export default Page;
