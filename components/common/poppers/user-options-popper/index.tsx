import EnrollUsersInCoursesModal from "@/components/common/modals/enroll-users-in-courses";
import PromptModal from "@/components/common/modals/prompt-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import UsersIcon from "@/components/icons/users-icon";
import { deleteUserByUserId } from "@/db/user";
import type { User } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

interface IProps {
  setSelectedUsersIds: Dispatch<SetStateAction<string[]>>;
  userId: string;
  onDone: () => void;
  currentUser: User;
}

const UserOptionsPopper: FunctionComponent<IProps> = ({
  userId,
  setSelectedUsersIds,
  onDone,
  currentUser,
}) => {
  // State
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [isEnrollUsersModalOpen, setIsEnrollUsersModalOpen] = useState(false);

  // Hooks
  const t = useTranslations();

  // Handlers
  const openEnrollUsersModal = () => setIsEnrollUsersModalOpen(true);
  const openDeleteUserModal = () => setIsDeleteUserModalOpen(true);

  const handleDeleteUser = async () => {
    try {
      await deleteUserByUserId(userId);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleteUserModalOpen(false);
      setSelectedUsersIds((prev) => prev.filter((id) => id !== userId));
      onDone();
      toast.success(t("user_deleted"));
    }
  };

  return (
    <>
      <BasePopper
        width="sm"
        trigger={
          <button className="icon-button text-neutral-500">
            <DotsIcon />
          </button>
        }
      >
        <ul className="flex flex-col">
          <li onClick={openEnrollUsersModal} className="popper-list-item">
            <UsersIcon /> Enroll
          </li>
          <li onClick={openDeleteUserModal} className="popper-list-item">
            <DeleteIcon /> Delete
          </li>
        </ul>
      </BasePopper>
      <PromptModal
        setIsOpen={setIsDeleteUserModalOpen}
        isOpen={isDeleteUserModalOpen}
        title="Delete user"
        action="Delete"
        body="Are you sure you want to delete this user?"
        actionHandler={handleDeleteUser}
      />
      <EnrollUsersInCoursesModal
        usersIds={[userId]}
        isOpen={isEnrollUsersModalOpen}
        setIsOpen={setIsEnrollUsersModalOpen}
        onDone={onDone}
        currentUser={currentUser}
      />
    </>
  );
};

export default UserOptionsPopper;
