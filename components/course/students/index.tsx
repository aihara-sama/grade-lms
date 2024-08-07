import IconTitle from "@/components/icon-title";
import AvatarIcon from "@/components/icons/avatar-icon";
import type { Database } from "@/types/supabase.type";
import type { FunctionComponent } from "react";

interface IProps {
  users: Database["public"]["Tables"]["users"]["Row"][];
}

const Students: FunctionComponent<IProps> = ({ users }) => {
  return (
    <div className="mt-4 flex flex-col flex-1">
      <p className="mb-2 font-bold">Students</p>
      <div className="flex-1 p-4 rounded-lg max-h-[453px] overflow-auto shadow-md">
        {users.map((user, idx, arr) => (
          <div key={idx} className="mb-4 [&:last-child]:mb-0">
            <div className="flex justify-between items-center mb-4">
              <IconTitle
                Icon={<AvatarIcon />}
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
