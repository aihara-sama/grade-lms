import AvatarIcon from "@/components/icons/avatar-icon";
import PollOption from "@/components/lesson/chat/poll/poll-option";

import type { FunctionComponent } from "react";

interface IProps {
  onDone: () => void;

  author: string;
  poll: {
    id: string;
    message_id: string;
    title: string;
    poll_options: {
      id: string;
      poll_id: string;
      title: string;
      votes: number;
    }[];
  };
}

const Poll: FunctionComponent<IProps> = ({ poll, author, onDone }) => {
  const totalVotes = poll.poll_options.reduce(
    (acc, pollOption) => pollOption.votes + acc,
    0
  );

  return (
    <div className="flex gap-[8px]">
      <AvatarIcon />
      <div className="rounded-[10px] p-[8px] w-full border border-gray-200">
        <div className="mb-[2px] text-sm text-link">{author}</div>
        <div className="text-sm mb-[6px]">{poll.title}</div>
        <div className="flex flex-col gap-[4px]">
          {poll.poll_options.map((pollOption) => (
            <PollOption
              totalVotes={totalVotes}
              key={pollOption.id}
              pollOption={pollOption}
              onDone={onDone}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Poll;
