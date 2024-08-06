import Users from "@/components/users";
import { createClient } from "@/helpers/supabase/server";

const Page = async () => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <div>
      <p className="page-title">Users</p>
      <p>View and manage users</p>
      <hr className="my-2 mb-4" />
      <Users user={user} />
    </div>
  );
};

export default Page;
