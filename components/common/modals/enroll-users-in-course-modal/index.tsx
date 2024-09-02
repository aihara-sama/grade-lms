import Avatar from "@/components/avatar";
import CardTitle from "@/components/card-title";
import BaseModal from "@/components/common/modals/base-modal";
import Table from "@/components/table";
import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";

import { enrollUsersInCourses, getUsersNotInCourse } from "@/db/user";
import { useUser } from "@/hooks/use-user";
import type { User } from "@/types/users";
import { db } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface Props {
  onClose: (mutated?: boolean) => void;
  courseId: string;
}

const EnrollUsersInCourseModal: FunctionComponent<Props> = ({
  courseId,
  onClose,
}) => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsersIds, setSelectedUsersIds] = useState<string[]>([]);

  // Refs
  const t = useTranslations();

  // Hooks
  const { user } = useUser();

  // Handlers
  const fetchUsersNotInCourse = async () => {
    try {
      setUsers(await getUsersNotInCourse(user.id, courseId));
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const enrollUsers = async () => {
    try {
      await enrollUsersInCourses(selectedUsersIds, [courseId]);
      onClose(true);
      toast(t("users_enrolled"));
      db.functions.invoke("check-events");
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const onUserToggle = (checked: boolean, userId: string) => {
    if (checked) {
      setSelectedUsersIds((prev) => [...prev, userId]);
    } else {
      setSelectedUsersIds((prev) => prev.filter((_id) => _id !== userId));
    }
  };
  // Effects
  useEffect(() => {
    fetchUsersNotInCourse();
  }, []);

  // View
  return (
    <BaseModal onClose={() => onClose()} title="Enrollment">
      <p className="mb-3 text-neutral-500">Select users to enroll</p>
      <div className="">
        <Table
          compact
          data={users.map(({ id, avatar, name, role }) => ({
            Name: (
              <CardTitle
                href={`/users/${id}`}
                checked={selectedUsersIds.includes(id)}
                Icon={<Avatar avatar={avatar} />}
                title={name}
                subtitle={role}
                onClick={() => {}}
                onToggle={(checked) => onUserToggle(checked, id)}
              />
            ),
            "": "",
          }))}
        />
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button className="outline-button" onClick={() => onClose()}>
          Cancel
        </button>
        <button
          disabled={!selectedUsersIds.length}
          className="primary-button"
          onClick={enrollUsers}
        >
          Enroll
        </button>
      </div>
    </BaseModal>
  );
};

export default EnrollUsersInCourseModal;
