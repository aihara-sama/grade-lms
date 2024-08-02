import AvatarIcon from "@/components/icons/avatar-icon";
import EmailIcon from "@/components/icons/email-icon";
import SecurityIcon from "@/components/icons/security-icon";
import Input from "@/components/input";
import type { FunctionComponent } from "react";

interface IProps {}

const GeneralTab: FunctionComponent<IProps> = () => {
  return (
    <>
      <Input
        name="name"
        Icon={<AvatarIcon size="xs" />}
        placeholder="Name"
        bottomSpacing
        fullWidth
      />
      <Input
        Icon={<EmailIcon size="xs" />}
        placeholder="Email"
        bottomSpacing
        fullWidth
        type="email"
        name="email"
      />
      <Input
        name="password"
        Icon={<SecurityIcon size="xs" />}
        placeholder="Password"
        fullWidth
        type="password"
      />
    </>
  );
};

export default GeneralTab;
