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
        Icon={<AvatarIcon size="sm" />}
        placeholder="Name"
        bottomSpacing
        fullWidth
      />
      <Input
        Icon={<EmailIcon size="sm" />}
        placeholder="Email"
        bottomSpacing
        fullWidth
        type="email"
        name="email"
      />
      <Input
        name="password"
        Icon={<SecurityIcon size="sm" />}
        placeholder="Password"
        fullWidth
        type="password"
      />
    </>
  );
};

export default GeneralTab;
