import type { CreateUser } from "@/actions/create-user-action/schema";
import type { ActionState } from "@/utils/validation/create-safe-action";
import type { User } from "@supabase/supabase-js";
import type { z } from "zod";

export type InputType = z.infer<typeof CreateUser>;
export type ReturnType = ActionState<User>;
