import Avatar from "@/components/avatar";
import type { ChatMessage } from "@/types/chat-messages";
import type { FunctionComponent } from "react";

interface IProps {
  chatMessage: ChatMessage;
}

const Message: FunctionComponent<IProps> = ({ chatMessage }) => {
  return (
    <div className="flex gap-2">
      <Avatar avatar={chatMessage.author_avatar} />
      <div className="rounded-[10px] p-2 w-full border border-gray-200">
        <div className="text-sm text-link">
          {chatMessage.author} ( {chatMessage.author_role} )
        </div>
        <div className="text-sm">{chatMessage.text}</div>
      </div>
    </div>
  );
};

export default Message;
