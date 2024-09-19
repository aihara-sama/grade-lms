import type { loadMessages } from "@/utils/load-messages";

type ServerErr = Record<
  string,
  Parameters<Awaited<ReturnType<typeof loadMessages>>>[0]
>;

const serverErrors: ServerErr = {
  "Password too short": "auth.password_too_short",
  "Invalid email": "auth.invalid_email",
  "Name is required": "auth.name_is_required",
  "An email address is too long": "auth.an_email_address_is_too_long",
  "User not found": "auth.user_not_found",
  "A user with this email address has already been registered":
    "auth.a_user_with_this_email_address_has_already_been_registered",
  "User already registered": "auth.user_already_registered",
  "Signup requires a valid password": "auth.signup_requires_a_valid_password",
  "Password should be at least 6 characters.":
    "auth.password_should_be_at_least_6_characters",
  "Password cannot be longer than 72 characters":
    "auth.password_cannot_be_longer_than_72_characters",
  "Unable to validate email address: invalid format":
    "auth.unable_to_validate_email_address_invalid_format",
  "To signup, please provide your email or phone number":
    "auth.to_signup_please_provide_your_email_or_phone_number",
  "Invalid login credentials": "auth.invalid_login_credentials",
};

export const serverErrToIntlKey = (error: keyof ServerErr) => {
  return serverErrors[error] || "something_went_wrong";
};
