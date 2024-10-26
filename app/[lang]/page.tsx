import Advantages from "@/app/[lang]/components/advantages";
import Features from "@/app/[lang]/components/features";
import Footer from "@/app/[lang]/components/footer";
import Header from "@/app/[lang]/components/header";
import Hero from "@/app/[lang]/components/hero";
import Services from "@/app/[lang]/components/services";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations();

  return {
    title: t("landing-page.metadata.title"),
    description: t("landing-page.metadata.title"),
    keywords:
      "LMS, Learning Management System, Users, Courses, Lessons, Assignments, Submissions, Schedule, Live",
    other: {
      title: t("landing-page.metadata.title"),
      description: t("landing-page.metadata.title"),
    },
  };
};

const Page = () => {
  return (
    <div className="">
      <Header className="mb-28" />
      <Hero className="mb-20" />
      <Features className="mb-20" />
      <Advantages className="mb-16" />
      <Services className="mb-16" />
      <Footer />
    </div>
  );
};

export default Page;
