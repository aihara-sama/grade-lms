import StudentrDashboard from "@/components/student-dashboard";
import TeacherDashboard from "@/components/teacher-dashboard";
import { getAssignments, getLatestAssignments } from "@/db/server/assignment";
import { getCourses, getLatestCourses } from "@/db/server/course";
import { getSubmissions } from "@/db/server/submission";
import { getMyUsers } from "@/db/server/user";
import { Role } from "@/enums/role.enum";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import type { NextPage } from "next";

const Page: NextPage = async () => {
  const {
    data: { user },
  } = await getServerDB().auth.getUser();

  if (user.user_metadata.role === Role.Teacher) {
    const [users, courses, latestCourses] = await Promise.all([
      getMyUsers({ head: true }),
      getCourses({ head: true }),
      getLatestCourses(),
    ]);

    return (
      <TeacherDashboard
        usersCount={users.count}
        coursesCount={courses.count}
        latestCourses={latestCourses}
      />
    );
  }

  if (user.user_metadata.role === Role.Student) {
    const [assignments, submissions, latestAssignments] = await Promise.all([
      getAssignments({ head: true }),
      getSubmissions({ head: true }),
      getLatestAssignments(),
    ]);

    return (
      <StudentrDashboard
        assignmentsCount={assignments.count}
        submissionsCount={submissions.count}
        latestAssignments={latestAssignments}
      />
    );
  }

  return null;
};

export default Page;
