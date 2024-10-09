"use client";

import BasicInput from "@/components/common/inputs/basic-input";
import AvatarIcon from "@/components/icons/avatar-icon";
import EmailIcon from "@/components/icons/email-icon";
import SecurityIcon from "@/components/icons/security-icon";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import { DEFAULT_AVATAR } from "@/constants";
import { Role } from "@/enums/role.enum";
import { DB } from "@/lib/supabase/db";
import { getTimeZone } from "@/utils/localization/get-time-zone";
import { serverErrToIntlKey } from "@/utils/localization/server-err-to-intl";
import type { UserMetadata } from "@supabase/supabase-js";
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

    const { error } = await DB.auth.signUp({
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
          push_notifications_state: "idle",
        } as UserMetadata,
      },
    });

    setIsSubmitting(false);

    if (error) toast.error(t(serverErrToIntlKey(error.message)));
    else {
      setIsSuccess(true);
      router.push(searchParams.get("redirect") || `/dashboard`);
    }
  };

  // View
  return (
    <div className="px-4 mx-auto max-w-64 h-screen translate-y-1/4">
      <p className="text-3xl font-bold text-neutral-600 mb-6 text-center">
        {t("sign_up.title")}
      </p>
      <form onSubmit={handleSubmit}>
        <BasicInput
          autoFocus
          required
          name="name"
          type="text"
          placeholder={t("placeholders.name")}
          StartIcon={<AvatarIcon size="xs" />}
          fullWidth
          maxLength={76}
          minLength={1}
        />
        <BasicInput
          required
          name="email"
          type="email"
          placeholder={t("placeholders.email")}
          StartIcon={<EmailIcon />}
          fullWidth
        />
        <BasicInput
          required
          name="password"
          type="password"
          placeholder={t("placeholders.password")}
          StartIcon={<SecurityIcon />}
          fullWidth
          minLength={6}
        />
        <button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="primary-button w-full"
        >
          {isSubmitting && <LoadingSpinner />}
          <span className={`${clsx(isSubmitting && "opacity-0")}`}>
            {t("buttons.create_account")}
          </span>
        </button>
      </form>
      <p className="text-sm">
        {t("sign_up.already_have_an_account?")}{" "}
        <Link
          href={`/sign-in/${searchParams.get("redirect") ? `?redirect=${searchParams.get("redirect")}` : ""} `}
          className="underline"
        >
          {t("links.login")}
        </Link>
      </p>
    </div>
  );
};

export default Page;
