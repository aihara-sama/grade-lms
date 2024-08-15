import Avatar from "@/components/avatar";
import CardTitle from "@/components/card-title";
import BaseModal from "@/components/common/modals/base-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import UsersIcon from "@/components/icons/users-icon";
import Table from "@/components/table";
import type { User } from "@/types/users";
import { supabaseClient } from "@/utils/supabase/client";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  courseId: string;
  currentUserId: string;
  onEnrolled: () => void;
}

const EnrollUsersInCourseModal: FunctionComponent<IProps> = ({
  isOpen,
  setIsOpen,
  courseId,
  currentUserId,
  onEnrolled,
}) => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsersIds, setSelectedUsersIds] = useState<string[]>([]);

  // Handlers
  const fetchUsersNotInCourse = async () => {
    const { data, error } = await supabaseClient
      .rpc("get_users_not_in_course", {
        p_course_id: courseId,
      })
      .eq("creator_id", currentUserId)
      .neq("id", currentUserId);

    if (error) {
      toast.error("Something went wrong");
    } else {
      setUsers(data);
    }
  };
  const enrollUsers = async () => {
    const { error } = await supabaseClient.from("user_courses").insert(
      selectedUsersIds.map((userId) => ({
        user_id: userId,
        course_id: courseId,
      }))
    );
    if (error) {
      toast(error.message);
    } else {
      toast("Users enrolled");
      onEnrolled();
    }
    setSelectedUsersIds([]);
    setIsOpen(false);
  };
  const closeModal = () => setIsOpen(false);
  const onUserToggle = (checked: boolean, userId: string) => {
    if (checked) {
      setSelectedUsersIds((prev) => [...prev, userId]);
    } else {
      setSelectedUsersIds((prev) => prev.filter((_id) => _id !== userId));
    }
  };
  // Effects
  useEffect(() => {
    if (isOpen) {
      fetchUsersNotInCourse();
    }
  }, [isOpen]);

  // View
  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} title="Enrollment">
      <p className="mb-3 text-neutral-500">Select users to enroll</p>
      <Table
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
          "": (
            <div>
              <BasePopper
                width="sm"
                trigger={
                  <button className="icon-button text-neutral-500">
                    <DotsIcon />
                  </button>
                }
              >
                <ul className="flex flex-col ">
                  <li onClick={() => {}} className="popper-list-item">
                    <UsersIcon /> Enroll
                  </li>
                  <li onClick={() => {}} className="popper-list-item">
                    <DeleteIcon /> Delete
                  </li>
                </ul>
              </BasePopper>
            </div>
          ),
        }))}
      />
      <div className="flex justify-end gap-3">
        <button className="outline-button" onClick={closeModal}>
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
