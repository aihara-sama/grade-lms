"use client";

import Insight from "@/components/common/insight";
import ChartSkeleton from "@/components/utilities/skeletons/chart-skeleton";
import { getWeekNames } from "@/utils/date/get-week-names";
import { parseInsights } from "@/utils/parse/parse-insights";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getLessonsInsights } from "@/db/client/lesson";
import { getMembersInsights } from "@/db/client/user";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

interface Props {
  courseId: string;
}

const Insights: FunctionComponent<Props> = ({ courseId }) => {
  // State
  const [lessonsInsights, setLessonsInsights] = useState<number[]>([]);
  const [membersInsights, setMembersInsights] = useState<number[]>([]);

  // Hooks
  const t = useTranslations();

  // Effects
  useEffect(() => {
    (async () => {
      try {
        const [
          { data: fetchedMembersInsights },
          { data: fetchedLessonsInsights },
        ] = await Promise.all([
          getMembersInsights(courseId),
          getLessonsInsights(courseId),
        ]);

        setMembersInsights(parseInsights(fetchedMembersInsights));
        setLessonsInsights(parseInsights(fetchedLessonsInsights));
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, []);

  return (
    <div>
      <p className="section-title">{t("sections.insights.title")}</p>
      <div className="flex gap-5 flex-col md:flex-row">
        {lessonsInsights.length ? (
          <Insight
            label={t("labels.lessons")}
            data={lessonsInsights}
            labels={getWeekNames()}
          />
        ) : (
          <div className="flex-1">
            <ChartSkeleton record={t("labels.lessons")} />
          </div>
        )}
        {membersInsights.length ? (
          <Insight
            label={t("labels.new_members")}
            data={membersInsights}
            labels={getWeekNames()}
          />
        ) : (
          <div className="flex-1">
            <ChartSkeleton record={t("labels.new_members")} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
