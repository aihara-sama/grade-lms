import BasicInput from "@/components/common/inputs/basic-input";
import AvatarIcon from "@/components/icons/avatar-icon";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import { updateUser } from "@/db/client/user";
import { useUser } from "@/hooks/use-user";
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
    try {
      await updateUser({
        id: user.id,
        name,
      });
      setUser({ ...user, name });

      toast.success(t("success.user_updated"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
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
