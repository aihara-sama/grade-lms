import StudentDashboard from "@/app/[lang]/dashboard/components/student-dashboard";
import TeacherDashboard from "@/app/[lang]/dashboard/components/teacher-dashboard";
import { getAssignments, getLatestAssignments } from "@/db/server/assignment";
import {
  getCourses,
  getCoursesInsights,
  getLatestCourses,
} from "@/db/server/course";
import { getDayLessons } from "@/db/server/lesson";
import { getSubmissions } from "@/db/server/submission";
import { getMyUsers, getProfile, getUsersInsights } from "@/db/server/user";
import { Role } from "@/enums/role.enum";
import { parseInsights } from "@/utils/parse/parse-insights";
import { startOfDay } from "date-fns";
import type { NextPage } from "next";

const Page: NextPage = async () => {
  const {
    data: { user },
  } = await getProfile();

  if (user.user_metadata.role === Role.Teacher) {
    const [
      users,
      courses,
      latestCourses,
      dayLessons,
      usersInsights,
      coursesInsights,
    ] = await Promise.all([
      getMyUsers({ head: true }),
      getCourses({ head: true }),
      getLatestCourses(),
      getDayLessons(startOfDay(new Date())),
      getUsersInsights(),
      getCoursesInsights(),
    ]);

    return (
      <TeacherDashboard
        dayLessons={dayLessons}
        usersCount={users.count}
        coursesCount={courses.count}
        latestCourses={latestCourses}
        usersInsights={Object.values(parseInsights(usersInsights.data))}
        coursesInsights={Object.values(parseInsights(coursesInsights.data))}
      />
    );
  }

  if (user.user_metadata.role === Role.Student) {
    const [assignments, submissions, latestAssignments, dayLessons] =
      await Promise.all([
        getAssignments({ head: true }),
        getSubmissions({ head: true }),
        getLatestAssignments(),
        getDayLessons(startOfDay(new Date())),
      ]);

    return (
      <StudentDashboard
        dayLessons={dayLessons}
        assignmentsCount={assignments.count}
        submissionsCount={submissions.count}
        latestAssignments={latestAssignments}
      />
    );
  }

  return null;
};

export default Page;
