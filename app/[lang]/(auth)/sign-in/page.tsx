"use client";

import BasicInput from "@/components/common/inputs/basic-input";
import EmailIcon from "@/components/icons/email-icon";
import SecurityIcon from "@/components/icons/security-icon";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import { DB } from "@/lib/supabase/db";
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = new FormData(e.currentTarget);

    const email = String(payload.get("email")).trim();
    const password = String(payload.get("password"));

    setIsSubmitting(true);

    const { error } = await DB.auth.signInWithPassword({
      email,
      password,
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
        {t("sign_in.title")}
      </p>
      <form onSubmit={handleSubmit}>
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
        />
        <button
          disabled={isSubmitting || isSuccess}
          className="primary-button w-full"
        >
          {isSubmitting && <LoadingSpinner />}
          <span className={`${clsx(isSubmitting && "opacity-0")}`}>
            {t("buttons.login")}
          </span>
        </button>
      </form>
      <p className="text-sm">
        {t("sign_in.dont_have_an_account?")}{" "}
        <Link
          href={`/sign-up/${searchParams.get("redirect") ? `?redirect=${searchParams.get("redirect")}` : ""} `}
          className="underline"
        >
          {t("links.join")}
        </Link>
      </p>
    </div>
  );
};

export default Page;
