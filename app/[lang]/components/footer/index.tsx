import type { PropsWithClassName } from "@/types/props.type";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { FunctionComponent } from "react";

const Footer: FunctionComponent<PropsWithClassName> = ({ className }) => {
  // Hooks
  const t = useTranslations();

  // View
  return (
    <footer className={`${className} bg-link py-9`}>
      <h1 className="text-white text-2xl font-bold text-center mb-4">
        {t(`landing_page.footer.title`)}
      </h1>
      <p className="text-center text-white text-sm mb-5">
        {t(`landing_page.footer.subtitle`)}
      </p>
      <div className="flex justify-center">
        <Link href="/sign-up" className="button bg-white text-link">
          {t("buttons.get_started")}
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
