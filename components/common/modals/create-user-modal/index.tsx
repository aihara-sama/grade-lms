"use client";

import tz from "timezones-list";

import AvatarUpload from "@/components/avatar-upload";
import AvatarIcon from "@/components/icons/avatar-icon";
import CameraIcon from "@/components/icons/camera-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import EmailIcon from "@/components/icons/email-icon";
import SecurityIcon from "@/components/icons/security-icon";
import Input from "@/components/input";
import Tabs from "@/components/tabs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import type { InputType as UserInputType } from "@/actions/create-user-action/types";
import BaseModal from "@/components/common/modals/base-modal";
import Select from "@/components/common/select";
import { createUser } from "@/db/user";
import type { ISelectItem } from "@/interfaces/menu.interface";
import { Role } from "@/interfaces/user.interface";
import { getTimeZone } from "@/utils/get-time-zone";
import { useTranslations } from "next-intl";
import type {
  ChangeEvent,
  Dispatch,
  FunctionComponent,
  SetStateAction,
} from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDone: () => void;
}

const initUserDetails: UserInputType = {
  name: "",
  email: "",
  password: "",
  avatar: process.env.NEXT_PUBLIC_DEFAULT_AVATAR,
  timezone: getTimeZone(),
};

const CreateUserModal: FunctionComponent<IProps> = ({
  onDone,
  isOpen,
  setIsOpen,
}) => {
  const [userDetails, setUserDetails] = useState(initUserDetails);
  const [timezones, setTimezones] = useState<ISelectItem[]>([]);

  const t = useTranslations();

  const submitCreateUser = async (createAnother?: boolean) => {
    try {
      await createUser(userDetails);
      setUserDetails(initUserDetails);
      if (!createAnother) {
        setIsOpen(false);
      }
      onDone();
      toast.success(t("user_created"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onTimezoneChange = (timezone: ISelectItem) =>
    setUserDetails((_) => ({ ..._, timezone: timezone.title }));

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUserDetails((_) => ({ ..._, [e.target.name]: e.target.value }));

  const onAvatarChange = (avatar: string) =>
    setUserDetails((_) => ({ ..._, avatar }));

  useEffect(() => {
    if (!isOpen) setUserDetails(initUserDetails);
  }, [isOpen]);

  useEffect(() => {
    setTimezones(tz.map(({ label }) => ({ id: label, title: label })));
  }, []);
  return (
    <BaseModal
      isExpanded={false}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Create user"
    >
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
                    fullWIdth
                    name="name"
                    Icon={<AvatarIcon size="xs" />}
                    label="Name"
                    autoFocus
                  />
                  <Input
                    onChange={onInputChange}
                    value={userDetails.email}
                    Icon={<EmailIcon size="xs" />}
                    label="Email"
                    type="email"
                    name="email"
                    fullWIdth
                  />
                  <Input
                    onChange={onInputChange}
                    value={userDetails.password}
                    name="password"
                    Icon={<SecurityIcon size="xs" />}
                    label="Password"
                    type="password"
                    fullWIdth
                  />
                  <div>
                    <p className="mb-1 text-sm font-bold text-neutral-500">
                      Timezone
                    </p>
                    <Select
                      popperProps={{
                        placement: "top",
                        popperClassName: "h-[251px]",
                      }}
                      label=""
                      options={timezones}
                      fullWidth
                      defaultValue={{
                        id: userDetails.timezone,
                        title: userDetails.timezone,
                      }}
                      onChange={onTimezoneChange}
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
            Create
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default CreateUserModal;
