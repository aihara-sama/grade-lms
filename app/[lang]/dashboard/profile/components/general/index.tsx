import UpdateName from "@/app/[lang]/dashboard/profile/components/general/update-name";
import type { PropsWithClassName } from "@/types/props.type";
import type { FunctionComponent } from "react";

const General: FunctionComponent<PropsWithClassName> = ({ className = "" }) => {
  // View
  return (
    <div className={className}>
      <p className="text-2xl font-bold text-neutral-600 mb-3">Profile</p>
      <UpdateName />
    </div>
  );
};

export default General;
