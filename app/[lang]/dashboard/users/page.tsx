import Users from "@/components/users";
import { Role } from "@/enums/role.enum";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { redirect } from "next/navigation";

const Page = async () => {
  const {
    data: { user },
  } = await getServerDB().auth.getUser();

  if (user.user_metadata.role !== Role.Teacher) return redirect("/dashboard");

  return (
    <div className="h-full flex flex-col">
      <p className="text-3xl font-bold text-neutral-600">Users</p>
      <p className="text-neutral-500">View and manage users</p>
      <hr className="my-2 mb-4" />
      <Users />
    </div>
  );
};

export default Page;
