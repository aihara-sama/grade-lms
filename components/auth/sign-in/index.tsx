"use client";

import EmailIcon from "@/components/icons/email-icon";
import SecurityIcon from "@/components/icons/security-icon";
import Input from "@/components/input";
import { DB } from "@/lib/supabase/db";
import { serverErrToIntlKey } from "@/utils/server-err-to-intl";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

const SignIn: FunctionComponent = () => {
  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Hooks
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handlers
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = new FormData(e.currentTarget);

    const email = String(payload.get("email")).trim();
    const password = String(payload.get("password"));

    setIsSubmitting(true);

    const { error, data } = await DB.auth.signInWithPassword({
      email,
      password,
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
  return (
    <div className="px-4 mx-auto max-w-64 h-screen translate-y-1/4">
      <p className="page-title mb-6 text-center">Login</p>
      <form onSubmit={handleSubmit}>
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
        />
        <button
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
          <span className={`${clsx(isSubmitting && "opacity-0")}`}>Login</span>
        </button>
      </form>
      <p className="text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href={`/sign-up/${searchParams.get("redirect") ? `?redirect=${searchParams.get("redirect")}` : ""} `}
          className="underline"
        >
          Join
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
