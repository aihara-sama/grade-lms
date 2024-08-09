import Users from "@/components/users";
import { createClient } from "@/utils/supabase/server";

const Page = async () => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <div>
      <p className="page-title">Users</p>
      <p className="text-neutral-500">View and manage users</p>
      <hr className="my-2 mb-4" />
      <Users user={user} />
    </div>
  );
};

export default Page;
