import UpdateName from "@/components/profile/general/update-name";
import type { PropsWithClassName } from "@/types/props.type";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

const General: FunctionComponent<PropsWithClassName> = ({ className = "" }) => {
  // Hooks
  const t = useTranslations();

  // View
  return (
    <div className={className}>
      <p className="text-2xl font-bold text-neutral-600 mb-3">{t("profile")}</p>
      <UpdateName />
    </div>
  );
};

export default General;
