import AvatarUpload from "@/components/avatar-upload";
import type { FunctionComponent } from "react";

interface IProps {}

const AvatarTab: FunctionComponent<IProps> = () => {
  return <AvatarUpload onChange={(_) => {}} />;
};

export default AvatarTab;
