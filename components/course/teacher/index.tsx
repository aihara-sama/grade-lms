import IconTitle from "@/components/icon-title";
import { ROLES } from "@/interfaces/user.interface";
import type { FunctionComponent } from "react";

interface IProps {
  name: string;
  id: string;
  avatar: string;
}

const Teacher: FunctionComponent<IProps> = ({ id, name, avatar }) => {
  return (
    <div className="mt-10">
      <p className="mb-2 font-bold">Teacher</p>
      <div className="flex justify-between items-center p-3 rounded-lg shadow-md">
        <IconTitle
          Icon={
            <img
              className="rounded-[50%] w-7 h-7 object-cover "
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`}
              alt=""
            />
          }
          href={`/users/${id}`}
          title={name}
          subtitle={ROLES.TEACHER}
        />
      </div>
    </div>
  );
};

export default Teacher;
