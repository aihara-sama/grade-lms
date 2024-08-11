import type { Database } from "@/types/supabase.type";
import type { FunctionComponent } from "react";

interface IProps {
  message: Database["public"]["Tables"]["messages"]["Row"];
}

const Message: FunctionComponent<IProps> = ({ message }) => {
  return (
    <div className="flex gap-2">
      <img
        className="rounded-[50%] w-8 h-8"
        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${message.author_avatar}`}
        alt=""
      />
      <div className="rounded-[10px] p-2 w-full border border-gray-200">
        <div className="text-sm text-link">
          {message.author} ( {message.author_role} )
        </div>
        <div className="text-sm">{message.text}</div>
      </div>
    </div>
  );
};

export default Message;
