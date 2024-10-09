"use client";

import Insight from "@/components/common/insight";
import ChartSkeleton from "@/components/utilities/skeletons/chart-skeleton";
import { useUser } from "@/hooks/use-user";
import type { Locale } from "@/i18n";
import { getWeekNames } from "@/utils/date/get-week-names";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

interface Props {
  assignmentsInsights: number[];
  submissionsInsights: number[];
}

const StudentInsights: FunctionComponent<Props> = ({
  assignmentsInsights,
  submissionsInsights,
}) => {
  // Hooks
  const t = useTranslations();
  const user = useUser((state) => state.user);

  // View
  return (
    <div>
      <p className="section-title">{t("dashboard.insights")}</p>
      <div className="flex gap-5 flex-col md:flex-row">
        {assignmentsInsights.length ? (
          <Insight
            shouldCalcRightSide={false}
            label={t("dashboard.assignments")}
            data={assignmentsInsights}
            labels={getWeekNames(user.preferred_locale as Locale)}
          />
        ) : (
          <div className="flex-1">
            <ChartSkeleton record={t("dashboard.assignments")} />
          </div>
        )}
        {submissionsInsights.length ? (
          <Insight
            shouldCalcRightSide={false}
            label={t("dashboard.submissions")}
            data={submissionsInsights}
            labels={getWeekNames(user.preferred_locale as Locale)}
          />
        ) : (
          <div className="flex-1">
            <ChartSkeleton record={t("dashboard.submissions")} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentInsights;
