import Avatar from "@/components/avatar";
import IconTitle from "@/components/icon-title";
import { Role } from "@/enums/role.enum";
import type { User } from "@/types/user.type";
import type { FunctionComponent } from "react";

interface Props {
  teacher: User;
}

const Teacher: FunctionComponent<Props> = ({ teacher }) => {
  return (
    <div className="mt-10">
      <p className="mb-2 font-bold">Teacher</p>
      <div className="flex justify-between items-center p-3 rounded-lg shadow-md">
        <IconTitle
          Icon={<Avatar avatar={teacher.avatar} />}
          href={`/users/${teacher.id}`}
          title={teacher.name}
          subtitle={Role.Teacher}
        />
      </div>
    </div>
  );
};

export default Teacher;
