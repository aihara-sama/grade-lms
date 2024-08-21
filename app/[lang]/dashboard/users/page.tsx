import Users from "@/components/users";
import { createClient } from "@/utils/supabase/server";

const Page = async () => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <div className="h-full flex flex-col">
      <p className="text-3xl font-bold text-neutral-600">Users</p>
      <p className="text-neutral-500">View and manage users</p>
      <hr className="my-2 mb-4" />
      <Users currentUser={user} />
    </div>
  );
};

export default Page;
