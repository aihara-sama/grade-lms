import CardTitle from "@/components/card-title";
import { supabaseClient } from "@/utils/supabase/client";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import BaseModal from "@/components/common/modals/base-modal";
import type { User } from "@/types/users";
import type { User as IUser } from "@supabase/supabase-js";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  courseId: string;
  user: IUser;
  onDone: () => void;
}

const EnrollUsersModal: FunctionComponent<IProps> = ({
  courseId,
  user,
  isOpen,
  setIsOpen,
  onDone,
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
      setIsOpen(false);
      onDone();
    }
  };

  // Effects
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <BaseModal setIsOpen={setIsOpen} isOpen={isOpen} header="Enroll users">
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
    </BaseModal>
  );
};

export default EnrollUsersModal;
