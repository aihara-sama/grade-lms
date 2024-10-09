"use client";

import Insight from "@/components/common/insight";
import ChartSkeleton from "@/components/utilities/skeletons/chart-skeleton";
import type { getCourses } from "@/db/client/course";
import { getCoursesInsights } from "@/db/client/course";
import { getUsersInsights } from "@/db/client/user";
import { useUser } from "@/hooks/use-user";
import type { Locale } from "@/i18n";
import type { ResultOf } from "@/types/utils.type";
import { getWeekNames } from "@/utils/date/get-week-names";
import { parseInsights } from "@/utils/parse/parse-insights";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  courses: ResultOf<typeof getCourses>["data"];
}

const TeacherInsights: FunctionComponent<Props> = ({ courses }) => {
  // Hooks
  const t = useTranslations();
  const user = useUser((state) => state.user);

  // State
  const [usersInsights, setUsersInsights] = useState([]);
  const [coursesInsights, setCoursesInsights] = useState([]);

  // Effects
  useEffect(() => {
    (async () => {
      try {
        const [
          { data: fetchedUsersInsights },
          { data: fetchedCoursesInsights },
        ] = await Promise.all([getUsersInsights(), getCoursesInsights()]);

        if (fetchedUsersInsights.length) {
          setUsersInsights(Object.values(parseInsights(fetchedUsersInsights)));
        }
        if (fetchedCoursesInsights.length) {
          setCoursesInsights(
            Object.values(parseInsights(fetchedCoursesInsights))
          );
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, [courses]);

  return (
    <div>
      <p className="section-title">{t("dashboard.insights")}</p>
      <div className="flex gap-5 flex-col md:flex-row">
        {coursesInsights.length ? (
          <Insight
            label={t("labels.users")}
            shouldCalcRightSide={false}
            data={usersInsights}
            labels={getWeekNames(user.preferred_locale as Locale)}
          />
        ) : (
          <div className="flex-1">
            <ChartSkeleton record={t("labels.users")} />
          </div>
        )}
        {coursesInsights.length ? (
          <Insight
            label={t("labels.courses")}
            shouldCalcRightSide={false}
            data={coursesInsights}
            labels={getWeekNames(user.preferred_locale as Locale)}
          />
        ) : (
          <div className="flex-1">
            <ChartSkeleton record={t("labels.courses")} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherInsights;
