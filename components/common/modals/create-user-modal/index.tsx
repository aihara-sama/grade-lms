"use client";

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
import { createUser } from "@/db/user";
import { Role } from "@/interfaces/user.interface";
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
};

const CreateUserModal: FunctionComponent<IProps> = ({
  onDone,
  isOpen,
  setIsOpen,
}) => {
  const [userDetails, setUserDetails] = useState(initUserDetails);

  const t = useTranslations();

  const handleCreateUser = async (createAnother?: boolean) => {
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUserDetails((_) => ({ ..._, [e.target.name]: e.target.value }));

  const handleAvatarChange = (avatar: string) =>
    setUserDetails((_) => ({ ..._, avatar }));

  useEffect(() => {
    if (!isOpen) setUserDetails(initUserDetails);
  }, [isOpen]);

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
                    onChange={handleInputChange}
                    value={userDetails.name}
                    fullWIdth
                    name="name"
                    Icon={<AvatarIcon size="xs" />}
                    label="Name"
                    autoFocus
                  />
                  <Input
                    onChange={handleInputChange}
                    value={userDetails.email}
                    Icon={<EmailIcon size="xs" />}
                    label="Email"
                    type="email"
                    name="email"
                    fullWIdth
                  />
                  <Input
                    onChange={handleInputChange}
                    value={userDetails.password}
                    name="password"
                    Icon={<SecurityIcon size="xs" />}
                    label="Password"
                    type="password"
                    className="mb-auto"
                    fullWIdth
                  />
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
                    onChange={handleAvatarChange}
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
            onClick={() => handleCreateUser(true)}
            className="outline-button"
            type="button"
          >
            Create & add another
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => handleCreateUser()}
          >
            Create
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default CreateUserModal;
