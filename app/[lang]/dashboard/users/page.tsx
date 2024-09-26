import Users from "@/components/users";
import { Role } from "@/enums/role.enum";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { redirect } from "next/navigation";

const Page = async () => {
  const {
    data: { user },
  } = await getServerDB().auth.getUser();

  if (user.user_metadata.role !== Role.Teacher) return redirect("/dashboard");

  return <Users user={user} />;
};

export default Page;
