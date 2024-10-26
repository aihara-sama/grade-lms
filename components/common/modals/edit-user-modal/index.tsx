"use client";

import AvatarUpload from "@/components/common/avatar-upload";
import AvatarIcon from "@/components/icons/avatar-icon";
import CameraIcon from "@/components/icons/camera-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import EmailIcon from "@/components/icons/email-icon";
import SecurityIcon from "@/components/icons/security-icon";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import BasicInput from "@/components/common/inputs/basic-input";
import BasicModal from "@/components/common/modals/basic-modal";
import TimezoneSelect from "@/components/common/selects/timezone-select";
import BasicTabs from "@/components/common/tabs/basic-tabs";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import LoadingSkeleton from "@/components/utilities/skeletons/loading-skeleton";
import type { getMyUsers } from "@/db/client/user";
import { getUser, updateUser } from "@/db/client/user";
import type { ResultOf } from "@/types/utils.type";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import type { ChangeEvent, FunctionComponent } from "react";

interface Props {
  userId: string;
  onClose: (updatedUser?: ResultOf<typeof getMyUsers>["data"][number]) => void;
}

const EditUserModal: FunctionComponent<Props> = ({ onClose, userId }) => {
  // Hooks
  const t = useTranslations();

  // State
  const [user, setUser] =
    useState<ResultOf<typeof getMyUsers>["data"][number]>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handlers
  const fetchUser = async () => {
    setIsLoading(true);

    try {
      setUser(await getUser(userId));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const submitUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const payload = new FormData(e.currentTarget);
      const password = String(payload.get("password"));

      await updateUser({
        id: user.id,
        name: user.name,
        email: user.email,
        timezone: user.timezone,
        ...(password.length ? { password } : {}),
      });
      onClose(user);

      toast.success(t("success.user_updated"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onTimezoneChange = (timezone: string) => {
    setUser((_) => ({ ..._, timezone }));
  };
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUser((_) => ({ ..._, [e.target.name]: e.target.value }));

  const onAvatarChange = (avatar: string) => setUser((_) => ({ ..._, avatar }));

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <BasicModal
      isFixedHeight={false}
      onClose={() => onClose()}
      title={t("modal.titles.edit_user")}
    >
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <form noValidate onSubmit={submitUpdateUser}>
          <BasicTabs
            tabs={[
              {
                tier: ["teacher"],
                title: t("tabs.general.title"),
                Icon: <OverviewIcon />,
                content: (
                  <>
                    <BasicInput
                      onChange={onInputChange}
                      value={user.name}
                      fullWidth
                      name="name"
                      StartIcon={<AvatarIcon size="xs" />}
                      label={t("labels.name")}
                      autoFocus
                    />
                    <BasicInput
                      onChange={onInputChange}
                      value={user.email}
                      StartIcon={<EmailIcon size="xs" />}
                      label={t("labels.email")}
                      type="email"
                      name="email"
                      fullWidth
                    />
                    <BasicInput
                      name="password"
                      StartIcon={<SecurityIcon size="xs" />}
                      label={t("labels.password")}
                      type="password"
                      fullWidth
                    />
                    <div>
                      <p className="mb-1 text-sm font-bold text-neutral-500">
                        {t("labels.timezone")}
                      </p>
                      <TimezoneSelect
                        onChange={onTimezoneChange}
                        defaultTimezone={user.timezone}
                      />
                    </div>
                  </>
                ),
              },
              {
                tier: ["teacher"],
                title: t("tabs.avatar.title"),
                Icon: <CameraIcon />,
                content: (
                  <div className="flex justify-center mx-[0] my-[23.5px]">
                    <AvatarUpload
                      onChange={onAvatarChange}
                      avatar={user.avatar}
                    />
                  </div>
                ),
              },
            ]}
          />
          <hr className="mb-4" />
          <div className="flex justify-end gap-3">
            <button className="primary-button" type="submit">
              {isSubmitting && <LoadingSpinner />}
              <span className={`${clsx(isSubmitting && "opacity-0")}`}>
                {t("buttons.save")}
              </span>
            </button>
          </div>
        </form>
      )}
    </BasicModal>
  );
};

export default EditUserModal;
