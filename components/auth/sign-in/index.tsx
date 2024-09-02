"use client";

import EmailIcon from "@/components/icons/email-icon";
import SecurityIcon from "@/components/icons/security-icon";
import Input from "@/components/input";
import { db } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {}

const SignIn: FunctionComponent<Props> = () => {
  // Hooks
  const router = useRouter();

  // Handlers
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = new FormData(e.currentTarget);

    const email = String(payload.get("email")).trim();
    const password = String(payload.get("password"));

    const { error } = await db.auth.signInWithPassword({
      email,
      password,
    });

    if (error) toast(error.message);
    else router.push("/dashboard");
  };
  return (
    <div className="px-4 mx-auto max-w-64 h-screen translate-y-1/4">
      <p className="page-title mb-6 text-center">Login</p>
      <form onSubmit={handleSubmit}>
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
        <button className="primary-button w-full">Login</button>
      </form>
      <p className="text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="underline">
          Join
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
