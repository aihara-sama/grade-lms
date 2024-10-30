import CalendarIcon from "@/components/icons/calendar-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import UsersIcon from "@/components/icons/users-icon";
import type { PropsWithClassName } from "@/types/props.type";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

const Features: FunctionComponent<PropsWithClassName> = ({ className }) => {
  // Hooks
  const t = useTranslations();

  // View
  return (
    <section className={`${className} container`}>
      <h1 className="text-3xl font-bold mb-8 text-center">
        {t(`landing_page.features.title`)}
      </h1>
      <div className="flex flex-col md:flex-row justify-between gap-5 items-stretch">
        {[UsersIcon, LessonsIcon, CalendarIcon].map((Icon, idx) => (
          <div
            key={idx}
            className="w-full md:w-96 rounded-md flex flex-col gap-2 shadow-md p-6 "
          >
            <Icon size="sm" />
            <p className="text-neutral-600 text-lg font-bold">
              {t(`landing_page.features.cards.${idx as 0 | 1 | 2}.title`)}
            </p>
            <p className="text-neutral-500 text-sm">
              {t(`landing_page.features.cards.${idx as 0 | 1 | 2}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
