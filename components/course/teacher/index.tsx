import Avatar from "@/components/avatar";
import IconTitle from "@/components/icon-title";
import { Role } from "@/interfaces/user.interface";
import type { User } from "@/types/users";
import { createClient } from "@/utils/supabase/server";
import type { FunctionComponent } from "react";

interface Props {
  teacher: User;
}

const Teacher: FunctionComponent<Props> = async ({ teacher }) => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <div className="mt-10">
      <p className="mb-2 font-bold">Teacher</p>
      <div className="flex justify-between items-center p-3 rounded-lg shadow-md">
        <IconTitle
          Icon={<Avatar avatar={teacher.avatar} />}
          href={`/${user.user_metadata.preferred_locale}/users/${teacher.id}`}
          title={teacher.name}
          subtitle={Role.Teacher}
        />
      </div>
    </div>
  );
};

export default Teacher;
