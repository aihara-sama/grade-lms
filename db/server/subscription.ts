import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { format } from "date-fns";

// GET
export const getCanceledSubscription = async (userId: string) => {
  const { data } = await getServerDB()
    .from("subscriptions")
    .select("end_date")
    .eq("user_id", userId)
    .gte("end_date", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"))
    .maybeSingle();

  return data;
};
