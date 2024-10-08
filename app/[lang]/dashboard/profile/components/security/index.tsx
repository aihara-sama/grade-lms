import UpdatePassword from "@/app/[lang]/dashboard/profile/components/security/update-password";
import type { PropsWithClassName } from "@/types/props.type";
import type { FunctionComponent } from "react";

const Security: FunctionComponent<PropsWithClassName> = ({
  className = "",
}) => {
  // View
  return (
    <div className={className}>
      <p className="text-2xl font-bold text-neutral-600 mb-3">Security</p>
      <UpdatePassword />
    </div>
  );
};

export default Security;
