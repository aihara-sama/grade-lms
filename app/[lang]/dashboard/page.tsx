import StudentrDashboard from "@/components/student-dashboard";
import TeacherDashboard from "@/components/teacher-dashboard";
import type { IUserMetadata } from "@/interfaces/user.interface";
import { Role } from "@/interfaces/user.interface";
import { createClient } from "@/utils/supabase/server";
import type { ReactNode } from "react";

const Page = async () => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  let Dashborad: ReactNode;

  if ((user.user_metadata as IUserMetadata).role === Role.TEACHER) {
    const [
      {
        data: { courses },
      },
      {
        data: { count: usersCount },
      },
    ] = await Promise.all([
      createClient()
        .from("users")
        .select("courses(count)")
        .eq("id", user.id)
        .returns<Record<"courses", { count: number }[]>[]>()
        .single(),
      createClient()
        .from("users")
        .select("count")
        .eq("creator_id", user.id)
        .returns<Record<"count", number>[]>()
        .single(),
    ]);

    Dashborad = (
      <TeacherDashboard
        user={user}
        totalUsersCount={usersCount}
        totalCoursesCount={courses[0].count}
      />
    );
  }

  if ((user.user_metadata as IUserMetadata).role === Role.STUDENT) {
    const [{ data: meWithAssignmentsCount }, { data: submissions }] =
      await Promise.all([
        createClient()
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
        createClient()
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
