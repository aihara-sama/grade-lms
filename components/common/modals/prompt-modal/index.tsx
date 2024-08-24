import BaseModal from "@/components/common/modals/base-modal";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  body: string;
  action: "Delete" | "Dispel";
  actionHandler: () => void;
  isInsideModal?: boolean;
}

const PromptModal: FunctionComponent<IProps> = ({
  title,
  body,
  isOpen,
  action,
  isInsideModal,
  setIsOpen,
  actionHandler,
}) => {
  return (
    <BaseModal
      isInsideModal={isInsideModal}
      isExpanded={false}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={`${title}`}
    >
      <p className="mb-4">{body}</p>
      <div className="flex justify-end gap-3">
        <button className="outline-button" onClick={() => setIsOpen(false)}>
          Cancel
        </button>
        <button className="primary-button" onClick={actionHandler}>
          {action}
        </button>
      </div>
    </BaseModal>
  );
};

export default PromptModal;
