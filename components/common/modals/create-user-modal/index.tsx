"use client";

import { createUser } from "@/actions/create-user";
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

import BaseModal from "@/components/common/modals/base-modal";
import type { IUserMetadata } from "@/interfaces/user.interface";
import type { User } from "@supabase/supabase-js";
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
  user: User;
}

const initUserDetails = {
  name: "",
  email: "",
  password: "",
  avatar: process.env.NEXT_PUBLIC_DEFAULT_AVATAR,
};

const CreateUserModal: FunctionComponent<IProps> = ({
  onDone,
  user,
  isOpen,
  setIsOpen,
}) => {
  const [userDetails, setUserDetails] = useState(initUserDetails);

  const handleCreateUser = async (createAnother?: boolean) => {
    const { error } = await createUser({
      ...userDetails,
      preferred_locale: (user.user_metadata as IUserMetadata).preferred_locale,
    });

    toast(error || "User created");

    if (!error) {
      if (!createAnother) {
        setIsOpen(false);
      }
      setUserDetails(initUserDetails);
      onDone();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserDetails((_) => ({ ..._, [e.target.name]: e.target.value }));
  };
  return (
    <BaseModal
      isOpen={isOpen}
      setIsOpen={(_isOpen) => setIsOpen(_isOpen)}
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
            },
            {
              title: "Avatar",
              Icon: <CameraIcon />,
              content: (
                <div className="flex justify-center mx-[0] my-[23.5px]">
                  <AvatarUpload
                    setAvatar={(avatar) => {
                      setUserDetails((_) => ({ ..._, avatar }));
                    }}
                    avatar={userDetails.avatar}
                  />
                </div>
              ),
            },
          ]}
        />
        <hr className="mb-4" />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => handleCreateUser(true)}
            className="outline-button w-full"
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
