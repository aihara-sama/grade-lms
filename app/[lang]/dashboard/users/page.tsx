import Users from "@/components/users";
import { Role } from "@/interfaces/user.interface";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

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
