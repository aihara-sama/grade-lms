"use client";

import Container from "@/components/container";
import CourseHeader from "@/components/course/course-header";
import CourseInsights from "@/components/course/course-insights";
import OngoingLessonCard from "@/components/course/ongoing-lesson-card";
import Students from "@/components/course/students";
import Teacher from "@/components/course/teacher";
import AvatarIcon from "@/components/icons/avatar-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import Total from "@/components/total";
import type { getCourse } from "@/db/server/course";
import type { getOngoingLesson } from "@/db/server/lesson";
import { Role } from "@/enums/role.enum";
import type { ResultOf } from "@/types/utils.type";
import type { FunctionComponent } from "react";

interface Props {
  course: ResultOf<typeof getCourse>;
  ongoingLesson: ResultOf<typeof getOngoingLesson>;
}

const CourseOverview: FunctionComponent<Props> = ({
  course: { lessons, users, ...course },
  ongoingLesson,
}) => {
  const teacher = users.find(({ role }) => role === Role.Teacher);

  return (
    <Container>
      <CourseHeader course={course} />
      <div className="flex gap-8 flex-1 items-start">
        <div className="flex-1">
          <div className="mb-6">
            <p className="section-title">Overview</p>
            <div className="flex flex-wrap gap-6">
              <div className="lg:flex gap-6 hidden">
                <Total
                  title="Total members"
                  total={users.length}
                  link={`/dashboard/courses/${course.id}/members`}
                  Icon={<AvatarIcon size="lg" />}
                />
                <Total
                  title="Total lessons"
                  total={lessons.length}
                  link={`/dashboard/courses/${course.id}/lessons`}
                  Icon={<LessonsIcon size="lg" />}
                />
              </div>
              {ongoingLesson && <OngoingLessonCard lesson={ongoingLesson} />}
            </div>
          </div>
          <CourseInsights courseId={course.id} />
        </div>
        <div className="[flex-basis:300px] self-stretch xl:flex flex-col hidden">
          <Teacher teacher={teacher} />
          <Students users={users.filter(({ role }) => role === Role.Student)} />
        </div>
      </div>
    </Container>
  );
};

export default CourseOverview;
