import type { UpdateUser } from "@/actions/update-user-action/schema";
import type { ActionState } from "@/utils/validation/create-safe-action";
import type { z } from "zod";

export type InputType = z.infer<typeof UpdateUser>;
export type ReturnType = ActionState<null>;
