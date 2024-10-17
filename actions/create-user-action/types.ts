import type { CreateUser } from "@/actions/create-user-action/schema";
import type { getUser } from "@/db/client/user";
import type { ResultOf } from "@/types/utils.type";
import type { ActionState } from "@/utils/validation/create-safe-action";
import type { z } from "zod";

export type InputType = z.infer<typeof CreateUser>;
export type ReturnType = ActionState<ResultOf<typeof getUser>>;
