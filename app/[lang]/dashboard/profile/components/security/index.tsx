import UpdatePassword from "@/app/[lang]/dashboard/profile/components/security/update-password";
import type { PropsWithClassName } from "@/types/props.type";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

const Security: FunctionComponent<PropsWithClassName> = ({
  className = "",
}) => {
  // Hooks
  const t = useTranslations();

  // View
  return (
    <div className={className}>
      <p className="text-2xl font-bold text-neutral-600 mb-3">
        {t("profile.security")}
      </p>
      <UpdatePassword />
    </div>
  );
};

export default Security;
