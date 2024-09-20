import type { EditUser } from "@/actions/edit-user-action/schema";
import type { ActionState } from "@/utils/validation/create-safe-action";
import type { z } from "zod";

export type InputType = z.infer<typeof EditUser>;
export type ReturnType = ActionState<null>;
