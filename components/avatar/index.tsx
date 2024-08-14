import type { FunctionComponent } from "react";

interface IProps {
  avatar: string;
}

const Avatar: FunctionComponent<IProps> = ({ avatar }) => {
  return (
    <img
      className="rounded-[50%] size-8"
      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`}
      alt="Avatar"
    />
  );
};

export default Avatar;
