import type { CreateUser } from "@/actions/create-user/schema";
import type { ActionState } from "@/helpers/create-safe-action";
import type { z } from "zod";

export type InputType = z.infer<typeof CreateUser>;
export type ReturnType = ActionState<null>;
