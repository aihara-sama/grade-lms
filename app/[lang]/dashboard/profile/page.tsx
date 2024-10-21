import Profile from "@/app/[lang]/dashboard/profile/components/profile";
import { getCanceledSubscription } from "@/db/server/subscription";
import { getCachedUser } from "@/db/server/user";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations();

  return {
    title: t("profile.title"),
  };
};

const Page = async () => {
  const {
    data: { user },
  } = await getCachedUser();

  const canceledSubscription = await getCanceledSubscription(user.id);

  return <Profile canceledSubscription={canceledSubscription} />;
};

export default Page;
