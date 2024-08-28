"use client";

import AvatarIcon from "@/components/icons/avatar-icon";
import EmailIcon from "@/components/icons/email-icon";
import SecurityIcon from "@/components/icons/security-icon";
import Input from "@/components/input";
import { Role, type IUserMetadata } from "@/interfaces/user.interface";
import { serverErrToIntlKey } from "@/utils/server-err-to-intl";
import { db } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FunctionComponent } from "react";
import toast from "react-hot-toast";

const SignUp: FunctionComponent = () => {
  // Hooks
  const router = useRouter();
  const t = useTranslations();

  // Handlers
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = new FormData(e.currentTarget);

    const name = String(payload.get("name")).trim();
    const email = String(payload.get("email")).trim();
    const password = String(payload.get("password"));

    const { error } = await db.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: Role.Teacher,
          avatar: process.env.NEXT_PUBLIC_DEFAULT_AVATAR,
          preferred_locale: "en",
        } as IUserMetadata,
      },
    });

    if (error) toast(t(serverErrToIntlKey(error.message)));
    else router.push("/dashboard");
  };

  return (
    <div className="px-4 mx-auto max-w-64 h-screen translate-y-1/4">
      <p className="page-title mb-6 text-center">Create account</p>
      <form noValidate onSubmit={handleSubmit}>
        <Input
          name="name"
          type="text"
          placeholder="Name"
          Icon={<AvatarIcon size="xs" />}
          fullWIdth
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          Icon={<EmailIcon />}
          fullWIdth
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          Icon={<SecurityIcon />}
          fullWIdth
        />
        <button className="primary-button w-full">Create account</button>
      </form>
      <p className="text-sm">
        Already have an account?{" "}
        <Link href="/sign-in" className="underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
