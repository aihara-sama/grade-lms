"use client";

import SignOutIcon from "@/components/icons/sign-out-icon";
import { DB } from "@/lib/supabase/db";
import type { PropsWithClassName } from "@/types/props.type";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

const SignOutButton: FunctionComponent<PropsWithClassName> = ({
  className = "",
}) => {
  // Hooks
  const t = useTranslations();

  // Handlers
  const submitSignOut = async () => {
    try {
      const { error } = await DB.auth.signOut();

      if (error) throw new Error(t("error.something_went_wrong"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // View
  return (
    <button className={`primary-button ${className}`} onClick={submitSignOut}>
      <SignOutIcon /> {t("buttons.logout")}
    </button>
  );
};

export default SignOutButton;
