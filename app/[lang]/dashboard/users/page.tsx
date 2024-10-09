import Users from "@/app/[lang]/dashboard/users/components/users";
import { getMyUsers, getProfile } from "@/db/server/user";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations();

  return {
    title: t("users.title"),
  };
};

const Page = async () => {
  const [
    {
      data: { user },
    },
    myUsers,
  ] = await Promise.all([getProfile(), getMyUsers()]);

  if (user.user_metadata.role !== "teacher") return redirect("/dashboard");

  return <Users users={myUsers} />;
};

export default Page;
