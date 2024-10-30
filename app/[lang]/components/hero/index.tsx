import type { PropsWithClassName } from "@/types/props.type";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { FunctionComponent } from "react";

const Hero: FunctionComponent<PropsWithClassName> = ({ className }) => {
  // Hooks
  const t = useTranslations();

  // View
  return (
    <section className={`${className} container`}>
      <div className="flex justify-center">
        <h1 className="text-neutral-600 leading-tight text-4xl font-bold text-center mb-5 max-w-[480px]">
          {t("landing_page.hero.title")}
        </h1>
      </div>
      <p className="text-center text-neutral-500 text-lg mb-10">
        {t("landing_page.hero.subtitle")}
      </p>
      <div className="flex justify-center">
        <Link href="/sign-up" className="button link-button px-6">
          {t("buttons.get_started")}
        </Link>
      </div>
    </section>
  );
};

export default Hero;
