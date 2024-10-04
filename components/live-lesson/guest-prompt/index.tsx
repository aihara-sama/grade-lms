import AvatarIcon from "@/components/icons/avatar-icon";
import Input from "@/components/input";
import { useState } from "react";

import { Role } from "@/enums/role.enum";
import { useUser } from "@/hooks/use-user";
import { getTimeZone } from "@/utils/localization/get-time-zone";
import type { ChangeEvent, FunctionComponent } from "react";

interface Props {}

const GuestPrompt: FunctionComponent<Props> = () => {
  // State
  const [userName, setUserName] = useState("");

  // Hooks
  const { setUser } = useUser((state) => state);

  // Handlers
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUserName(e.target.value);

  const createGuestUser = () => {
    setUser({
      id: undefined,
      avatar: process.env.DEFAULT_AVATAR,
      created_at: new Date().toISOString(),
      creator_id: null,
      email: "",
      name: userName,
      role: Role.Guest,
      preferred_locale: "en",
      timezone: getTimeZone(),
      is_emails_on: false,
      push_notifications_state: "Off",
    });
  };

  // View
  return (
    <div className="flex flex-col justify-center items-center h-screen max-w-64 mx-auto my-0">
      <Input
        value={userName}
        onChange={handleInputChange}
        StartIcon={<AvatarIcon size="xs" />}
        label="Enter your name"
        autoFocus
        fullWidth
        className="w-full"
      />
      <button
        disabled={!userName}
        className="primary-button w-full"
        onClick={createGuestUser}
      >
        Join
      </button>
    </div>
  );
};

export default GuestPrompt;
