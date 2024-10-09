import NotFoundIcon from "@/components/icons/not-found-icon";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import type { FunctionComponent, ReactNode } from "react";

interface Props {
  variant?: "primary" | "secondary";
  action: ReactNode;
}

const NotFound: FunctionComponent<Props> = ({
  action,
  variant = "primary",
}) => {
  // Hooks
  const t = useTranslations();

  // View
  return (
    <div
      className={`flex justify-center mb-4 ${clsx({
        "mt-12": variant === "primary",
        "mt-4": variant === "secondary",
      })}`}
    >
      <div className="flex flex-col items-center">
        <NotFoundIcon
          {...(variant === "secondary" && { size: "xl" })}
          className={`${"mb-4"}`}
        />
        <p
          className={`${clsx(variant === "primary" && "text-xl")} text-center text-neutral-600 font-bold`}
        >
          {t("common.no_results_found")}
        </p>
        {variant === "primary" && (
          <p className="text-sm text-center max-w-96 my-2 text-neutral-500">
            {t("common.try_using_different_keywords_or_change_some_filters")}
          </p>
        )}
        {action}
      </div>
    </div>
  );
};

export default NotFound;
