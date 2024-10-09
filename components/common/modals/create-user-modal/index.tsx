"use client";

import AvatarUpload from "@/components/common/avatar-upload";
import AvatarIcon from "@/components/icons/avatar-icon";
import CameraIcon from "@/components/icons/camera-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import EmailIcon from "@/components/icons/email-icon";
import SecurityIcon from "@/components/icons/security-icon";
import { useState } from "react";
import toast from "react-hot-toast";

import type { InputType as UserInputType } from "@/actions/create-user-action/types";
import BasicInput from "@/components/common/inputs/basic-input";
import BasicModal from "@/components/common/modals/basic-modal";
import TimezoneSelect from "@/components/common/selects/timezone-select";
import BasicTabs from "@/components/common/tabs/basic-tabs";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import { DEFAULT_AVATAR } from "@/constants";
import { createUser } from "@/db/client/user";
import type { ResultOf } from "@/types/utils.type";
import { getTimeZone } from "@/utils/localization/get-time-zone";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import type { ChangeEvent, FunctionComponent } from "react";

interface Props {
  onClose: (maybeUser?: ResultOf<typeof createUser>) => void;
}

const initUser: UserInputType = {
  name: "",
  email: "",
  password: "",
  avatar: DEFAULT_AVATAR,
  timezone: getTimeZone(),
};

const CreateUserModal: FunctionComponent<Props> = ({ onClose }) => {
  // Hooks
  const t = useTranslations();

  // State
  const [user, setUser] = useState(initUser);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const submitCreateUser = async () => {
    setIsSubmitting(true);

    try {
      onClose(await createUser(user));

      toast.success(t("success.user_created"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onAvatarChange = (avatar: string) => {
    setUser((_) => ({ ..._, avatar }));
  };
  const onTimezoneChange = (timezone: string) => {
    setUser((_) => ({ ..._, timezone }));
  };
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser((_) => ({ ..._, [e.target.name]: e.target.value }));
  };

  // View
  return (
    <BasicModal
      isFixedHeight={false}
      onClose={() => onClose()}
      title={t("modal.titles.create_user")}
    >
      <form noValidate>
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
                    onChange={onInputChange}
                    value={user.password}
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
          <button className="outline-button" onClick={() => onClose()}>
            {t("buttons.cancel")}
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => submitCreateUser()}
          >
            {isSubmitting && <LoadingSpinner />}
            <span className={`${clsx(isSubmitting && "opacity-0")}`}>
              {t("buttons.create")}
            </span>
          </button>
        </div>
      </form>
    </BasicModal>
  );
};

export default CreateUserModal;
