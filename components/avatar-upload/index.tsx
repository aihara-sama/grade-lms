"use client";

import CameraIcon from "@/components/icons/camera-icon";
import { supabaseClient } from "@/utils/supabase/client";
import { type ChangeEvent, type FunctionComponent } from "react";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";

interface IProps {
  setAvatar: (avatar: string) => void;
  avatar: string;
}

const AvatarUpload: FunctionComponent<IProps> = ({ setAvatar, avatar }) => {
  const handleChangeAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    const avatarFile = e.target.files[0];

    const { data, error } = await supabaseClient.storage
      .from("avatars")
      .upload(`${uuid()}.png`, avatarFile);

    if (error) {
      toast.error("Something went wrong");
    } else {
      setAvatar(data.path);
    }
  };

  return (
    <div className="flex justify-center mx-[0] my-[23.5px]">
      <div className="flex relative">
        <img
          alt="avatar"
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`}
          className="[border-radius:50%] w-40 h-40"
        />
        <label>
          <div className="flex cursor-pointer absolute bottom-[2px] right-[12px] p-[10px] rounded-[50%] border border-3 border-white bg-gray-100 shadow-md hover:bg-gray-200 active:bg-gray-500">
            <CameraIcon size="sm" />
            <input
              onChange={handleChangeAvatar}
              type="file"
              id="avatar-file"
              className="hidden"
            />
          </div>
        </label>
      </div>
    </div>
  );
};

export default AvatarUpload;
