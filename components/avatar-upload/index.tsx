"use client";

import CameraIcon from "@/components/icons/camera-icon";
import { db } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";
import { type ChangeEvent, type FunctionComponent } from "react";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";

interface IProps {
  onChange: (avatar: string) => void;
  avatar: string;
}

const AvatarUpload: FunctionComponent<IProps> = ({ onChange, avatar }) => {
  const t = useTranslations();

  const handleChangeAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const avatarFile = e.target.files[0];

      const { data, error } = await db.storage
        .from("avatars")
        .upload(uuid(), avatarFile);

      if (error) throw new Error(t("something_went_wrong"));
      onChange(data.path);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex relative">
      <img
        alt="avatar"
        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`}
        className="rounded-[50%] w-40 h-40 border border-neutral-200 object-cover"
      />
      <label>
        <div className="flex cursor-pointer absolute bottom-[2px] right-[12px] p-[10px] rounded-[50%] border border-3 border-white bg-gray-100 shadow-md hover:bg-gray-200 active:bg-gray-500">
          <CameraIcon size="sm" />
          <input onChange={handleChangeAvatar} type="file" className="hidden" />
        </div>
      </label>
    </div>
  );
};

export default AvatarUpload;
