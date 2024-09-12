import type { PropsWithClassName } from "@/types";
import type { FunctionComponent } from "react";

interface Props {
  avatar: string;
}

const Avatar: FunctionComponent<PropsWithClassName<Props>> = ({
  avatar,
  className = "",
}) => {
  return (
    <img
      className={`rounded-[50%] size-8 ${className} object-cover`}
      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`}
      alt="Avatar"
    />
  );
};

export default Avatar;
