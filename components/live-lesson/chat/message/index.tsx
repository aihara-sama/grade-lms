import AvatarIcon from "@/components/icons/avatar-icon";
import type { Database } from "@/types/supabase.type";
import type { FunctionComponent } from "react";

interface IProps {
  message: Database["public"]["Tables"]["messages"]["Row"];
}

const Message: FunctionComponent<IProps> = ({ message }) => {
  return (
    <div className="flex gap-[8px]">
      <AvatarIcon />
      <div className="rounded-[10px] p-[8px] w-full border border-gray-200">
        <div className="mb-[2px] text-sm text-link">{message.author}</div>
        <div className="text-sm">{message.text}</div>
      </div>
    </div>
  );
};

export default Message;
