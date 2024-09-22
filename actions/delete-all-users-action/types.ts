import type { DeleteUsers } from "@/actions/delete-all-users-action/schema";
import type { ActionState } from "@/utils/validation/create-safe-action";
import type { z } from "zod";

export type InputType = z.infer<typeof DeleteUsers>;
export type ReturnType = ActionState<null>;
