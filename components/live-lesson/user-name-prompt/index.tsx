import AvatarIcon from "@/components/icons/avatar-icon";
import Input from "@/components/input";
import { useUser } from "@/hooks/use-user";
import { useState } from "react";
import { v4 as uuid } from "uuid";

import { Role } from "@/interfaces/user.interface";
import { getTimeZone } from "@/utils/get-time-zone";
import type { ChangeEvent, FunctionComponent } from "react";

interface IProps {}

const GuestPrompt: FunctionComponent<IProps> = () => {
  // State
  const [userName, setUserName] = useState("");

  // Hooks
  const userStore = useUser();

  // Handlers
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUserName(e.target.value);

  const createGuestUser = () =>
    userStore.setUser({
      id: uuid(),
      avatar: process.env.DEFAULT_AVATAR,
      created_at: new Date().toISOString(),
      creator_id: null,
      email: "",
      name: userName,
      role: Role.Guest,
      preferred_locale: "en",
      fcm_token: null,
      timezone: getTimeZone(),
    });

  // View
  return (
    <div className="flex flex-col justify-center items-center h-screen max-w-[400px] mx-auto my-0">
      <Input
        value={userName}
        onChange={handleInputChange}
        Icon={<AvatarIcon size="xs" />}
        label="Enter your name"
        autoFocus
      />
      <button
        disabled={!userName}
        className="primary-button"
        onClick={createGuestUser}
      >
        Join
      </button>
    </div>
  );
};

export default GuestPrompt;
