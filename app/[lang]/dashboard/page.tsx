import StudentrDashboard from "@/components/student-dashboard";
import TeacherDashboard from "@/components/teacher-dashboard";
import { Role } from "@/enums/role.enum";
import type { UserMetadata } from "@/interfaces/user.interface";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import type { ReactNode } from "react";

const Page = async () => {
  const serverDB = getServerDB();

  const {
    data: { user },
  } = await serverDB.auth.getUser();

  let Dashborad: ReactNode;

  if ((user.user_metadata as UserMetadata).role === Role.Teacher) {
    const [
      {
        data: { courses },
      },
      {
        data: { count: usersCount },
      },
    ] = await Promise.all([
      serverDB
        .from("users")
        .select("courses(count)")
        .eq("id", user.id)
        .returns<Record<"courses", { count: number }[]>[]>()
        .single(),
      serverDB
        .from("users")
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

  if ((user.user_metadata as UserMetadata).role === Role.Student) {
    const [{ data: meWithAssignmentsCount }, { data: submissions }] =
      await Promise.all([
        serverDB
          .from("users")
          .select("courses(lessons(assignments(count)))")
          .eq("id", user.id)
          .returns<
            Record<
              "courses",
              { lessons: { assignments: { count: number }[] }[] }[]
            >[]
          >()
          .single(),
        serverDB
          .from("submissions")
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
