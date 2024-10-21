import type { ActionState } from "@/utils/validation/create-safe-action";
import type { z } from "zod";

export type InputType = z.infer<null>;
export type ReturnType = ActionState<null>;
