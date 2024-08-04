"use client";

import Insight from "@/components/course/insight";

import { type FunctionComponent, type PropsWithChildren } from "react";

interface IProps {}

const CourseInsights: FunctionComponent<PropsWithChildren<IProps>> = () => {
  return (
    <div>
      <p className="section-title">Insights</p>
      <div className="flex gap-5 flex-col md:flex-row">
        <Insight
          label="Lessons"
          data={[0, 3, 1, 0, 0, 2, 1]}
          labels={["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]}
        />
        <Insight
          label="New users"
          data={[0, 2, 1, 0, 0, 2, 5]}
          labels={["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]}
        />
      </div>
    </div>
  );
};

export default CourseInsights;
