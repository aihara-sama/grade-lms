import type { loadMessages } from "@/utils/load-messages";

type ServerErr = Record<
  string,
  Parameters<Awaited<ReturnType<typeof loadMessages>>>[0]
>;

const serverErrors: ServerErr = {
  "An email address is too long": "auth.an_email_address_is_too_long",
  "A user with this email address has already been registered":
    "auth.user_already_registered",
};

export const serverErrToIntlKey = (error: keyof ServerErr) => {
  return serverErrors[error] || "something_went_wrong";
};
