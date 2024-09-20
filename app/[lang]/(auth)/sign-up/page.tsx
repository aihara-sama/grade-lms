"use client";

import AvatarIcon from "@/components/icons/avatar-icon";
import EmailIcon from "@/components/icons/email-icon";
import SecurityIcon from "@/components/icons/security-icon";
import Input from "@/components/input";
import { DEFAULT_AVATAR } from "@/constants";
import { Role } from "@/enums/role.enum";
import type { UserMetadata } from "@/interfaces/user.interface";
import { DB } from "@/lib/supabase/db";
import { getTimeZone } from "@/utils/localization/get-time-zone";
import { serverErrToIntlKey } from "@/utils/localization/server-err-to-intl";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

const Page: FunctionComponent = () => {
  // Hooks
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handlers
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = new FormData(e.currentTarget);

    const name = String(payload.get("name")).trim();
    const email = String(payload.get("email")).trim();
    const password = String(payload.get("password"));

    setIsSubmitting(true);

    const { error, data } = await DB.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: Role.Teacher,
          avatar: DEFAULT_AVATAR,
          preferred_locale: "en",
          timezone: getTimeZone(),
          is_emails_on: true,
          is_push_notifications_on: true,
        } as UserMetadata,
      },
    });

    setIsSubmitting(false);

    if (error) toast(t(serverErrToIntlKey(error.message)));
    else {
      setIsSuccess(true);

      router.push(
        searchParams.get("redirect") ||
          `/${data.user.user_metadata.preferred_locale}/dashboard`
      );
    }
  };

  // View
  return (
    <div className="px-4 mx-auto max-w-64 h-screen translate-y-1/4">
      <p className="page-title mb-6 text-center">Create account</p>
      <form onSubmit={handleSubmit}>
        <Input
          autoFocus
          required
          name="name"
          type="text"
          placeholder="Name"
          startIcon={<AvatarIcon size="xs" />}
          fullWidth
          maxLength={76}
          minLength={1}
        />
        <Input
          required
          name="email"
          type="email"
          placeholder="Email"
          startIcon={<EmailIcon />}
          fullWidth
        />
        <Input
          required
          name="password"
          type="password"
          placeholder="Password"
          startIcon={<SecurityIcon />}
          fullWidth
          minLength={6}
        />
        <button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="primary-button w-full"
        >
          {isSubmitting && (
            <img
              className="loading-spinner"
              src="/gifs/loading-spinner.gif"
              alt=""
            />
          )}
          <span className={`${clsx(isSubmitting && "opacity-0")}`}>
            Create account
          </span>
        </button>
      </form>
      <p className="text-sm">
        Already have an account?{" "}
        <Link
          href={`/sign-in/${searchParams.get("redirect") ? `?redirect=${searchParams.get("redirect")}` : ""} `}
          className="underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default Page;
