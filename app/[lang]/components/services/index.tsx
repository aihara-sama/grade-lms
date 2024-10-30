import ActivityIcon from "@/components/icons/activity-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import WhiteboardIcon from "@/components/icons/whiteboard-icon";
import type { PropsWithClassName } from "@/types/props.type";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

const Services: FunctionComponent<PropsWithClassName> = ({ className }) => {
  // Hooks
  const t = useTranslations();

  // View
  return (
    <section className={`${className} container`}>
      <h1 className="text-3xl font-semibold mb-12 text-center">
        {t(`landing_page.services.title`)}
      </h1>
      <div className="flex flex-col md:flex-row justify-between gap-3 items-stretch">
        {[WhiteboardIcon, OverviewIcon, ActivityIcon].map((Icon, idx) => (
          <div
            key={idx}
            className="w-full md:w-80 rounded-md flex items-center px-5 py-7 gap-6 shadow-md p-6"
          >
            <Icon size="sm" />
            <div>
              <p className="text-neutral-600 font-semibold">
                {t(`landing_page.services.cards.${idx as 0 | 1 | 2}.title`)}
              </p>
              <p className="text-neutral-500 text-sm">
                {" "}
                {t(
                  `landing_page.services.cards.${idx as 0 | 1 | 2}.description`
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
