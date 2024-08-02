import IconTitle from "@/components/icon-title";
import AvatarIcon from "@/components/icons/avatar-icon";
import MessagesIcon from "@/components/icons/messages-icon";
import type { Database } from "@/types/supabase.type";
import type { FunctionComponent } from "react";

interface IProps {
  users: Database["public"]["Tables"]["users"]["Row"][];
}

const Students: FunctionComponent<IProps> = ({ users }) => {
  return (
    <div className="mt-[16px] flex flex-col flex-[1]">
      <p className="mb-[8px] font-bold">Students</p>
      <div className="flex-[1] p-[16px] rounded-[8px] max-h-[453px] overflow-auto shadow-md">
        {users.map((user, idx, arr) => (
          <div key={idx} className="mb-[16px] [&:last-child]:mb-0">
            <div className="flex justify-between items-center mb-[16px]">
              <IconTitle
                Icon={<AvatarIcon />}
                href={`/users/${user.id}`}
                title={user.name}
                subtitle={user.role}
              />
              <button className="icon-button hover:bg-gray-100 active:bg-gray-200">
                <MessagesIcon />
              </button>
            </div>
            {idx !== arr.length - 1 && <hr />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Students;
