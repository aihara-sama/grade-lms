import Courses from "@/components/courses";
import { createClient } from "@/utils/supabase/server";

const Page = async () => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <div>
      <p className="page-title">Courses</p>
      <p className="text-neutral-500">View and manage courses</p>
      <hr className="my-2 mb-4" />
      <Courses user={user} />
    </div>
  );
};

export default Page;
