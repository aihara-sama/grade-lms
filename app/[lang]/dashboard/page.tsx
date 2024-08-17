import Dashboard from "@/components/dashboard";
import { createClient } from "@/utils/supabase/server";

const Page = async () => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

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

  return (
    <div>
      <p className="page-title">Dashboard</p>
      <p className="text-neutral-500 mb-4">Your LMS Command Center</p>
      <Dashboard
        user={user}
        totalUsersCount={usersCount}
        totalCoursesCount={courses[0].count}
      />
    </div>
  );
};

export default Page;
