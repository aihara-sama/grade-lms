import Users from "@/components/users";
import { createClient } from "@/utils/supabase/server";

const Page = async () => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <div className="page-wrapper">
      <p className="page-title">Users</p>
      <hr />
      <Users user={user} />
    </div>
  );
};

export default Page;
