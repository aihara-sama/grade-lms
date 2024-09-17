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
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email is required",
    })
    .email(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password is required",
    })
    .min(6, "Password too short"),
  is_emails_on: z.boolean({
    required_error: "Email preference is required",
  }),
  is_push_notifications_on: z.boolean({
    required_error: "Notifications preference is required",
  }),
});
