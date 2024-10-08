import Avatar from "@/components/common/avatar";
import IconTitle from "@/components/common/icon-title";
import type { User } from "@/types/user.type";
import type { FunctionComponent } from "react";

interface Props {
  users: User[];
}

const Students: FunctionComponent<Props> = ({ users }) => {
  return (
    <div className="mt-4 flex flex-col flex-1">
      <p className="mb-2 font-bold">Students</p>
      <div className="flex-1 p-4 rounded-lg max-h-[464px] overflow-auto shadow-md">
        {users.map((user, idx, arr) => (
          <div key={idx} className="mb-4 [&:last-child]:mb-0">
            <div className="flex justify-between items-center mb-4">
              <IconTitle
                Icon={<Avatar avatar={user.avatar} />}
                href={`/users/${user.id}`}
                title={user.name}
                subtitle={user.role}
              />
            </div>
            {idx !== arr.length - 1 && <hr />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Students;
