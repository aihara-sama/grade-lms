"use client";

import EmailIcon from "@/components/icons/email-icon";
import SecurityIcon from "@/components/icons/security-icon";
import Input from "@/components/input";
import { supabaseClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface IProps {}

const SignIn: FunctionComponent<IProps> = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = new FormData(e.currentTarget);

    const email = String(payload.get("email")).trim();
    const password = String(payload.get("password"));

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) toast(error.message);
    else router.push("/dashboard");
  };
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <p className="page-title mb-6">Sign In</p>
      <form onSubmit={handleSubmit} className="w-full sm:w-64">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          Icon={<EmailIcon />}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          Icon={<SecurityIcon />}
        />
        <button className="primary-button">Sign In</button>
      </form>
      <p>
        Don&apos;t have an account? <Link href="/sign-up">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;
