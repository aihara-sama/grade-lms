import AvatarIcon from "@/components/icons/avatar-icon";
import Input from "@/components/input";
import { useUserName } from "@/hooks/useUserName";
import { useState, type FunctionComponent } from "react";

interface IProps {}

const UserNamePrompt: FunctionComponent<IProps> = () => {
  const userNameStore = useUserName();
  const [userName, setUserName] = useState("");

  const handleJoin = () => {
    userNameStore.setUserName(userName);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen max-w-[400px] mx-[auto] my-[0]">
      <Input
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        Icon={<AvatarIcon size="xs" />}
        label="Enter your name"
        autoFocus
      />
      <button className="primary-button" onClick={handleJoin}>
        Join
      </button>
    </div>
  );
};

export default UserNamePrompt;
