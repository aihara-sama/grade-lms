import type { PostgrestBuilder } from "@supabase/postgrest-js";
import toast from "react-hot-toast";

export async function handle<T extends PostgrestBuilder<any>>(
  response: T,
  success: string,
  error: string
) {
  const result = await response;

  if (result.error && error) toast.error(error);
  else if (success) toast.success(success);

  return result;
}
