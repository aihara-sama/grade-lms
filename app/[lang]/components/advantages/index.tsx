import type { PropsWithClassName } from "@/types/props.type";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

const Advantages: FunctionComponent<PropsWithClassName> = ({ className }) => {
  // Hooks
  const t = useTranslations();

  // View
  return (
    <section className={`${className} container`}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-12">
        <div>
          <h1 className="text-2xl font-semibold mb-8">
            {t("landing_page.advantages.title")}
          </h1>
          <div className="pl-5 flex flex-col gap-2">
            {[...new Array(4)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="bg-black size-[10px]"></span>
                <p className="text-neutral-500 font-semibold">
                  {t(
                    `landing_page.advantages.list.${idx as 0 | 1 | 2 | 3}.title`
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
        <img src="/assets/svg/manage-everything.svg" alt="" />
      </div>
    </section>
  );
};

export default Advantages;
