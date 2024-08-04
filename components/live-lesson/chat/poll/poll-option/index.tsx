import { supabaseClient } from "@/utils/supabase/client";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface IProps {
  totalVotes: number;
  onDone: () => void;
  pollOption: {
    id: string;
    poll_id: string;
    title: string;
    votes: number;
  };
}

const PollOption: FunctionComponent<IProps> = ({
  pollOption,
  totalVotes,
  onDone,
}) => {
  const handleSubmitVote = async () => {
    const { error } = await supabaseClient
      .from("poll_options")
      .update({
        votes: pollOption.votes + 1,
      })
      .eq("id", pollOption.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Poll submitted");
      onDone();
    }
  };
  return (
    <div
      onClick={handleSubmitVote}
      className="cursor-pointer flex items-center gap-[4px] relative"
    >
      <input name="poll" type="radio" value={pollOption.title} />
      <div className="flex-[1] relative">{pollOption.title}</div>
      <div
        className={`absolute left-0 bottom-[-7px] h-[5px] w-[${(pollOption.votes / totalVotes) * 100}%] bg-link`}
      ></div>
    </div>
  );
};

export default PollOption;
