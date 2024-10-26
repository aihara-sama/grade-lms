import { z } from "zod";

export const UpdateUser = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name is required",
    })
    .min(1, {
      message: "Name is required",
    })
    .optional(),
  timezone: z
    .string({
      required_error: "Timezone is required",
      invalid_type_error: "Timezone is required",
    })
    .min(1, {
      message: "Timezone is required",
    })
    .optional(),
  avatar: z
    .string({
      required_error: "Avatar is required",
      invalid_type_error: "Avatar is required",
    })
    .min(1, {
      message: "Avatar is required",
    })
    .optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  preferred_locale: z.string().optional(),
  id: z
    .string({
      required_error: "Id is required",
      invalid_type_error: "Id is required",
    })
    .uuid("Id is required"),
});
