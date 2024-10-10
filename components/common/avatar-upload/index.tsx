"use client";

import CameraIcon from "@/components/icons/camera-icon";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import { MAX_AVATAR_SIZE } from "@/constants";
import { DB } from "@/lib/supabase/db";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useState, type ChangeEvent, type FunctionComponent } from "react";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";

interface Props {
  onChange: (avatar: string) => void;
  avatar: string;
}

const AvatarUpload: FunctionComponent<Props> = ({ onChange, avatar }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useTranslations();

  const handleChangeAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const allowedExtensions = ["image/jpeg", "image/png", "image/gif"];

        if (!allowedExtensions.includes(file.type))
          throw new Error(t("error.selected_file_ext_is_not_allowed"));

        if (file.size >= MAX_AVATAR_SIZE)
          throw new Error(t("error.file_size_too_big"));

        setIsSubmitting(true);
        const { data, error } = await DB.storage
          .from("avatars")
          .upload(uuid(), file);

        if (error) throw new Error(t("error.something_went_wrong"));
        onChange(data.path);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex relative">
      <img
        alt=""
        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`}
        className="rounded-[50%] w-40 h-40 border border-neutral-200 object-cover"
      />
      {isSubmitting && (
        <div>
          <div className="absolute inset-0 bg-neutral-950/20 rounded-[50%] z-10" />
          <LoadingSpinner className="size-16" />
        </div>
      )}
      <label>
        <div
          className={`flex ${clsx({
            "cursor-pointer": !isSubmitting,
            "cursor-default": isSubmitting,
          })} absolute z-20 bottom-[2px] right-[12px] p-[10px] rounded-[50%] border border-3 border-white bg-gray-100 shadow-md hover:bg-gray-200 active:bg-gray-500`}
        >
          <CameraIcon size="sm" />
          <input
            disabled={isSubmitting}
            accept=".jpg,.jpeg,.png,.gif"
            onChange={handleChangeAvatar}
            type="file"
            className="hidden"
          />
        </div>
      </label>
    </div>
  );
};

export default AvatarUpload;
