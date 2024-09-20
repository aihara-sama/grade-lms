import StudentrDashboard from "@/components/student-dashboard";
import TeacherDashboard from "@/components/teacher-dashboard";
import type { IUserMetadata } from "@/interfaces/user.interface";
import { Role } from "@/interfaces/user.interface";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import type { ReactNode } from "react";

const Page = async () => {
  const DB = getServerDB();
  const {
    data: { user },
  } = await DB.auth.getUser();

  let Dashborad: ReactNode;

  if ((user.user_metadata as IUserMetadata).role === Role.Teacher) {
    const [
      {
        data: { courses },
      },
      {
        data: { count: usersCount },
      },
    ] = await Promise.all([
      DB.from("users")
        .select("courses(count)")
        .eq("id", user.id)
        .returns<Record<"courses", { count: number }[]>[]>()
        .single(),
      DB.from("users")
        .select("count")
        .eq("creator_id", user.id)
        .returns<Record<"count", number>[]>()
        .single(),
    ]);

    Dashborad = (
      <TeacherDashboard
        totalUsersCount={usersCount}
        totalCoursesCount={courses[0].count}
      />
    );
  }

  if ((user.user_metadata as IUserMetadata).role === Role.Student) {
    const [{ data: meWithAssignmentsCount }, { data: submissions }] =
      await Promise.all([
        DB.from("users")
          .select("courses(lessons(assignments(count)))")
          .eq("id", user.id)
          .returns<
            Record<
              "courses",
              { lessons: { assignments: { count: number }[] }[] }[]
            >[]
          >()
          .single(),
        DB.from("submissions")
          .select("count")
          .eq("user_id", user.id)
          .returns<{ count: number }[]>(),
      ]);

    Dashborad = (
      <StudentrDashboard
        user={user}
        totalAssignmentsCount={
          meWithAssignmentsCount.courses[0]?.lessons[0]?.assignments[0]
            ?.count || 0
        }
        totalSubmissionsCount={submissions[0].count}
      />
    );
  }

  return (
    <div>
      <p className="page-title">Dashboard</p>
      <p className="text-neutral-500 mb-4">Your LMS Command Center</p>
      {Dashborad}
    </div>
  );
};

export default Page;
