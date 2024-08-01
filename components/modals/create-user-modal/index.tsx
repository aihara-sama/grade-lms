"use client";

import { createUser } from "@/actions/create-user";
import CameraIcon from "@/components/icons/camera-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import Modal from "@/components/modal";
import Tabs from "@/components/tabs";
import { type FunctionComponent } from "react";
import toast from "react-hot-toast";
import AvatarTab from "./tabs/avatar-tab";
import GeneralTab from "./tabs/general-tab";

interface IProps {
  onDone: () => void;
  closeModal: () => void;
}

const CreateUserModal: FunctionComponent<IProps> = ({ closeModal, onDone }) => {
  const handleCreateUser = async (formData: FormData) => {
    const { error } = await createUser({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    toast(error || "User created");

    if (!error) {
      onDone();
      closeModal();
    }
  };
  return (
    <Modal
      close={closeModal}
      title="Create user"
      content={
        <form noValidate action={handleCreateUser}>
          <Tabs
            tabs={[
              {
                title: "General",
                Icon: <OverviewIcon />,
                content: <GeneralTab />,
              },
              {
                title: "Avatar",
                Icon: <CameraIcon />,
                content: <AvatarTab />,
              },
            ]}
          />
          <hr />
          <div className="group-buttons">
            <button className="putline-button w-full">
              Create & add another
            </button>
            <button className="primary-button w-full" type="submit">
              Create
            </button>
          </div>
        </form>
      }
    />
  );
};

export default CreateUserModal;
