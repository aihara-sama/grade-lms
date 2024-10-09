import BasicInput from "@/components/common/inputs/basic-input";
import AvatarIcon from "@/components/icons/avatar-icon";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import { useUser } from "@/hooks/use-user";
import { DB } from "@/lib/supabase/db";
import type { UserMetadata } from "@supabase/supabase-js";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

const UpdateName: FunctionComponent = () => {
  // Hooks
  const t = useTranslations();
  const { user, setUser } = useUser((state) => state);

  // State
  const [name, setName] = useState(user.name);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const submitUpdateName = async () => {
    setIsSubmitting(true);

    const { error } = await DB.auth.updateUser({
      data: {
        name,
      } as UserMetadata,
    });

    setIsSubmitting(false);

    if (error) toast.error(t("error.something_went_wrong"));
    else {
      setUser({ ...user, name });
      toast.success(t("success.user_updated"));
    }
  };

  // View
  return (
    <div className="flex items-end gap-[4px]">
      <BasicInput
        onChange={(e) => setName(e.target.value)}
        value={name}
        fullWidth
        name="name"
        StartIcon={<AvatarIcon size="xs" />}
        label={t("labels.name")}
        autoFocus
        className="mb-auto"
      />
      <button
        disabled={name === user.name || !name.length || isSubmitting}
        className="primary-button w-[100px]"
        onClick={submitUpdateName}
      >
        {isSubmitting && <LoadingSpinner />}
        <span className={`${clsx(isSubmitting && "opacity-0")}`}>
          {t("buttons.save")}
        </span>
      </button>
    </div>
  );
};

export default UpdateName;
