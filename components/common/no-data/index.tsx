import NoDataIcon from "@/components/icons/no-data-icon";
import { useTranslations } from "next-intl";
import type { FunctionComponent, ReactNode } from "react";

interface Props {
  body: string;
  action: ReactNode;
}

const NoData: FunctionComponent<Props> = ({ action, body }) => {
  const t = useTranslations();

  return (
    <div className="flex justify-center mt-12">
      <div className="flex flex-col items-center">
        <NoDataIcon />
        <p className="mt-4 font-bold mb-2 text-xl">
          {t("common.view_your_work_in_a_list")}
        </p>
        <p className="text-sm text-neutral-500 max-w-96 mb-3">{body}</p>
        {action}
      </div>
    </div>
  );
};

export default NoData;
