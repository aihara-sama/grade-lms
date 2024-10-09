import Users from "@/app/[lang]/dashboard/users/components/users";
import { getMyUsers, getProfile } from "@/db/server/user";
import { redirect } from "next/navigation";

const Page = async () => {
  const [
    {
      data: { user },
    },
    myUsers,
  ] = await Promise.all([getProfile(), getMyUsers()]);

  if (user.user_metadata.role !== "teacher") return redirect("/dashboard");

  return <Users users={myUsers} />;
};

export default Page;
