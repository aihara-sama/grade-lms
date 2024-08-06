import CardTitle from "@/components/card-title";
import AvatarIcon from "@/components/icons/avatar-icon";
import Modal from "@/components/modal";
import { supabaseClient } from "@/helpers/supabase/client";
import type { Database } from "@/types/supabase.type";
import { useEffect, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface IProps {
  close: () => void;
  courseId: string;
}

const EnrollUsersModal: FunctionComponent<IProps> = ({ close, courseId }) => {
  const [users, setUsers] = useState<
    Database["public"]["Tables"]["users"]["Row"][]
  >([]);
  const [usersIds, setUsersIds] = useState<string[]>([]);
  const getUsers = async () => {
    const data = await supabaseClient.from("users").select("*");
    setUsers(data.data);
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
            {users.map((user) => (
              <div className="flex items-center justify-between" key={user.id}>
                <CardTitle
                  checked={usersIds.includes(user.id)}
                  Icon={<AvatarIcon size="md" />}
                  title={user.name}
                  subtitle={user.role}
                  onClick={() => {}}
                  onToggle={(checked) =>
                    checked
                      ? setUsersIds((prev) => [...prev, user.id])
                      : setUsersIds((prev) =>
                          prev.filter((id) => id !== user.id)
                        )
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
