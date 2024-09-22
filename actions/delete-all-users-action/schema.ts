import { z } from "zod";

export const DeleteUsers = z.object({
  userName: z.string({
    required_error: "Username is required",
    invalid_type_error: "Username is required",
  }),
});
