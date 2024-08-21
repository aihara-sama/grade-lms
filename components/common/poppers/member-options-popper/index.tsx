import PromptModal from "@/components/common/modals/prompt-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import { dispelUsersFromCourse } from "@/db/user";
import { useTranslations } from "next-intl";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

interface IProps {
  setSelectedMembersIds: Dispatch<SetStateAction<string[]>>;
  memberId: string;
  courseId: string;
  onDone: () => void;
}

const MemberOptionsPopper: FunctionComponent<IProps> = ({
  memberId,
  setSelectedMembersIds,
  onDone,
  courseId,
}) => {
  // State
  const [isDispelMemberModalOpen, setIsDispelMemberModalOpen] = useState(false);

  // Hooks
  const t = useTranslations();

  // Handlers
  const openDispelMemberModal = () => setIsDispelMemberModalOpen(true);

  const handleВшызудUser = async () => {
    try {
      await dispelUsersFromCourse([memberId], courseId);
      setIsDispelMemberModalOpen(false);
      setSelectedMembersIds((prev) => prev.filter((id) => id !== memberId));
      toast.success(t("user_deleted"));
      onDone();
    } catch (error: any) {
      toast.error(error.message);
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
          <li onClick={openDispelMemberModal} className="popper-list-item">
            <DeleteIcon /> Dispel
          </li>
        </ul>
      </BasePopper>
      <PromptModal
        setIsOpen={setIsDispelMemberModalOpen}
        isOpen={isDispelMemberModalOpen}
        title="Dispel user"
        action="Dispel"
        body={t("prompts.dispel_user")}
        actionHandler={handleВшызудUser}
      />
    </>
  );
};

export default MemberOptionsPopper;
