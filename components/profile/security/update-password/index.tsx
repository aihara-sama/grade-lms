import SecurityIcon from "@/components/icons/security-icon";
import Input from "@/components/input";
import LoadingSpinner from "@/components/loading-spinner";
import { DB } from "@/lib/supabase/db";
import { serverErrToIntlKey } from "@/utils/localization/server-err-to-intl";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

const UpdatePassword: FunctionComponent = () => {
  // Hooks
  const t = useTranslations();

  // State
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const submiUpdatePassword = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await DB.auth.updateUser({
        password,
      });
      if (error) throw new Error(t(serverErrToIntlKey(error.message)));

      setPassword("");

      toast.success(t("password_changed"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // View
  return (
    <div className="flex items-end gap-[4px]">
      <Input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        fullWidth
        name="password"
        StartIcon={<SecurityIcon size="xs" />}
        label="Password"
        className="mb-auto"
      />
      <button
        disabled={!password.length || isSubmitting}
        className="primary-button"
        onClick={submiUpdatePassword}
      >
        {isSubmitting && <LoadingSpinner />}
        <span className={`${clsx(isSubmitting && "opacity-0")}`}>
          Change password
        </span>
      </button>
    </div>
  );
};

export default UpdatePassword;
