"use client";

import AvatarUpload from "@/components/avatar-upload";
import AvatarIcon from "@/components/icons/avatar-icon";
import CameraIcon from "@/components/icons/camera-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import EmailIcon from "@/components/icons/email-icon";
import SecurityIcon from "@/components/icons/security-icon";
import Input from "@/components/input";
import Tabs from "@/components/tabs";
import { useState } from "react";
import toast from "react-hot-toast";

import type { InputType as UserInputType } from "@/actions/create-user-action/types";
import BaseModal from "@/components/common/modals/base-modal";
import LoadingSpinner from "@/components/loading-spinner";
import TimezoneSelect from "@/components/timezone-select";
import { DEFAULT_AVATAR } from "@/constants";
import { createUser } from "@/db/user";
import { Role } from "@/enums/role.enum";
import { getTimeZone } from "@/utils/localization/get-time-zone";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import type { ChangeEvent, FunctionComponent } from "react";

interface Props {
  onClose: (mutated?: boolean) => void;
}

const initUserDetails: UserInputType = {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState(initUserDetails);

  // Handlers
  const submitCreateUser = async (createAnother?: boolean) => {
    setIsSubmitting(true);

    try {
      await createUser(userDetails);

      if (createAnother) {
        setUserDetails(initUserDetails);
      } else {
        onClose(true);
      }
      toast.success(t("user_created"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onAvatarChange = (avatar: string) => {
    setUserDetails((_) => ({ ..._, avatar }));
  };
  const onTimezoneChange = (timezone: string) => {
    setUserDetails((_) => ({ ..._, timezone }));
  };
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserDetails((_) => ({ ..._, [e.target.name]: e.target.value }));
  };

  // View
  return (
    <BaseModal isExpanded={false} onClose={() => onClose()} title="Create user">
      <form noValidate>
        <Tabs
          tabs={[
            {
              title: "General",
              Icon: <OverviewIcon />,
              content: (
                <>
                  <Input
                    onChange={onInputChange}
                    value={userDetails.name}
                    fullWidth
                    name="name"
                    StartIcon={<AvatarIcon size="xs" />}
                    label="Name"
                    autoFocus
                  />
                  <Input
                    onChange={onInputChange}
                    value={userDetails.email}
                    StartIcon={<EmailIcon size="xs" />}
                    label="Email"
                    type="email"
                    name="email"
                    fullWidth
                  />
                  <Input
                    onChange={onInputChange}
                    value={userDetails.password}
                    name="password"
                    StartIcon={<SecurityIcon size="xs" />}
                    label="Password"
                    type="password"
                    fullWidth
                  />
                  <div>
                    <p className="mb-1 text-sm font-bold text-neutral-500">
                      Timezone
                    </p>
                    <TimezoneSelect
                      onChange={onTimezoneChange}
                      defaultTimezone={userDetails.timezone}
                    />
                  </div>
                </>
              ),
              tier: [Role.Teacher],
            },
            {
              title: "Avatar",
              Icon: <CameraIcon />,
              content: (
                <div className="flex justify-center mx-[0] my-[23.5px]">
                  <AvatarUpload
                    onChange={onAvatarChange}
                    avatar={userDetails.avatar}
                  />
                </div>
              ),
              tier: [Role.Teacher],
            },
          ]}
        />
        <hr className="mb-4" />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => submitCreateUser(true)}
            className="outline-button"
            type="button"
          >
            Create & add another
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => submitCreateUser()}
          >
            {isSubmitting && <LoadingSpinner />}
            <span className={`${clsx(isSubmitting && "opacity-0")}`}>
              Create
            </span>
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default CreateUserModal;
