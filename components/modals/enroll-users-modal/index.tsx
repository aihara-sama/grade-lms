import CardTitle from "@/components/card-title";
import Modal from "@/components/modal";
import { supabaseClient } from "@/utils/supabase/client";
import { useEffect, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

import type { User } from "@/types/users";
import type { User as IUser } from "@supabase/supabase-js";

interface IProps {
  close: () => void;
  courseId: string;
  user: IUser;
}

const EnrollUsersModal: FunctionComponent<IProps> = ({
  close,
  courseId,
  user,
}) => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [usersIds, setUsersIds] = useState<string[]>([]);

  // Handlers
  const getUsers = async () => {
    const { data } = await supabaseClient
      .rpc("get_users_not_in_course", {
        p_course_id: courseId,
      })
      .eq("creator_id", user.id)
      .neq("id", user.id);

    setUsers(data);
  };
  const enroll = async () => {
    const { error } = await supabaseClient.from("user_courses").insert(
      usersIds.map((userId) => ({
        user_id: userId,
        course_id: courseId,
      }))
    );

    if (error) {
      toast(error.message);
    } else {
      toast("Users enrolled");
      getUsers();
      close();
    }
  };

  // Effects
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Modal
      close={close}
      title="Enroll users"
      content={
        <div>
          <div className="mb-[12px] flex flex-col gap-[12px]">
            {users.map((u) => (
              <div className="flex items-center justify-between" key={u.id}>
                <CardTitle
                  href={`/users/${u.id}`}
                  checked={usersIds.includes(u.id)}
                  Icon={
                    <img
                      className="rounded-[50%] w-8 h-8"
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${u.avatar}`}
                      alt=""
                    />
                  }
                  title={u.name}
                  subtitle={u.role}
                  onClick={() => {}}
                  onToggle={(checked) =>
                    checked
                      ? setUsersIds((prev) => [...prev, u.id])
                      : setUsersIds((prev) => prev.filter((id) => id !== u.id))
                  }
                />
              </div>
            ))}
          </div>
          <button className="primary-button" onClick={enroll}>
            Enroll
          </button>
        </div>
      }
    />
  );
};

export default EnrollUsersModal;
