import Schedule from "@/components/schedule";
import { createClient } from "@/helpers/supabase/server";

const Page = async () => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <div>
      <Schedule user={user} />
    </div>
  );
};

export default Page;
