"use client";

import AvatarIcon from "@/components/icons/avatar-icon";
import EmailIcon from "@/components/icons/email-icon";
import SecurityIcon from "@/components/icons/security-icon";
import Input from "@/components/input";
import { ROLES, type IUserMetadata } from "@/interfaces/user.interface";
import { supabaseClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface IProps {}

const SignUp: FunctionComponent<IProps> = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = new FormData(e.currentTarget);

    const name = String(payload.get("name")).trim();
    const email = String(payload.get("email")).trim();
    const password = String(payload.get("password"));

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: ROLES.TEACHER,
          avatar: "default-avatar",
        } as IUserMetadata,
      },
    });

    if (error) toast(error.message);
    else router.push("/dashboard");
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen mx-4">
      <p className="page-title mb-6">Sign Up</p>
      <form noValidate onSubmit={handleSubmit} className="w-full sm:w-64">
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
        <button className="primary-button">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link href="/sign-in">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUp;
