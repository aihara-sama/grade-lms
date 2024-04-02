import type { ActionState } from "@/utils/create-safe-action";
import type { z } from "zod";
import type { CreateUser } from "./schema";

export type InputType = z.infer<typeof CreateUser>;
export type ReturnType = ActionState<null>;
