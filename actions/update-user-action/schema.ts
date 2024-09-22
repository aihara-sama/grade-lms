import { z } from "zod";

export const UpdateUser = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name is required",
    })
    .min(1, {
      message: "Name is required",
    }),
  timezone: z
    .string({
      required_error: "Timezone is required",
      invalid_type_error: "Timezone is required",
    })
    .min(1, {
      message: "Timezone is required",
    }),
  avatar: z
    .string({
      required_error: "Avatar is required",
      invalid_type_error: "Avatar is required",
    })
    .min(1, {
      message: "Avatar is required",
    }),
  email: z.string().email(),
  password: z.string().optional(),
  id: z
    .string({
      required_error: "Id is required",
      invalid_type_error: "Id is required",
    })
    .uuid("Id is required"),
});
