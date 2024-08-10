import { z } from "zod";

export const CreateUser = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name is required",
    })
    .min(1, {
      message: "Name is required",
    }),
  avatar: z
    .string({
      required_error: "Avatar is required",
      invalid_type_error: "Avatar is required",
    })
    .min(1, {
      message: "Avatar is required",
    }),
  preferred_locale: z
    .string({
      required_error: "Preferred locale is required",
      invalid_type_error: "Preferred locale is required",
    })
    .length(2, {
      message: "Preferred locale is required",
    }),
  email: z.string().email(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password is required",
    })
    .min(6, "Password too short"),
});
