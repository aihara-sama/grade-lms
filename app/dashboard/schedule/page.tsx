import Schedule from "@/components/schedule";
import { createClient } from "@/utils/supabase/server";

const Page = async () => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <div className="page-wrapper">
      <Schedule user={user} />
    </div>
  );
};

export default Page;
