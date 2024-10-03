import StudentrDashboard from "@/components/student-dashboard";
import TeacherDashboard from "@/components/teacher-dashboard";
import {
  getAssignmentsCount,
  getLatestAssignments,
} from "@/db/server/assignment";
import { getCoursesCount, getLatestCourses } from "@/db/server/course";
import { getSubmissionsCount } from "@/db/server/submission";
import { getMyUsersCount } from "@/db/server/user";
import { Role } from "@/enums/role.enum";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import type { NextPage } from "next";
import type { ReactNode } from "react";

const Page: NextPage = async () => {
  const {
    data: { user },
  } = await getServerDB().auth.getUser();

  let Dashborad: ReactNode;

  if (user.user_metadata.role === Role.Teacher) {
    const [usersCount, coursesCount, latestCourses] = await Promise.all([
      getMyUsersCount(user.id),
      getCoursesCount(),
      getLatestCourses(),
    ]);

    Dashborad = (
      <TeacherDashboard
        usersCount={usersCount}
        coursesCount={coursesCount}
        latestCourses={latestCourses}
      />
    );
  }

  if (user.user_metadata.role === Role.Student) {
    const [assignmentsCount, submissionsCount, latestAssignments] =
      await Promise.all([
        getAssignmentsCount(),
        getSubmissionsCount(),
        getLatestAssignments(),
      ]);

    Dashborad = (
      <StudentrDashboard
        assignmentsCount={assignmentsCount}
        submissionsCount={submissionsCount}
        latestAssignments={latestAssignments}
      />
    );
  }

  return <>{Dashborad}</>;
};

export default Page;
