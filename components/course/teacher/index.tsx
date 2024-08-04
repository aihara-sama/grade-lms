import IconTitle from "@/components/icon-title";
import AvatarIcon from "@/components/icons/avatar-icon";
import { ROLES } from "@/interfaces/user.interface";
import type { FunctionComponent } from "react";

interface IProps {
  name: string;
  id: string;
}

const Teacher: FunctionComponent<IProps> = ({ id, name }) => {
  return (
    <div className="mt-10">
      <p className="mb-2 font-bold">Teacher</p>
      <div className="flex justify-between items-center p-3 rounded-lg shadow-md">
        <IconTitle
          Icon={<AvatarIcon />}
          href={`/users/${id}`}
          title={name}
          subtitle={ROLES.TEACHER}
        />
      </div>
    </div>
  );
};

export default Teacher;
