import BaseModal from "@/components/common/modals/base-modal";
import type { FunctionComponent } from "react";

interface Props {
  onClose: () => void;
  title: string;
  body: string;
  action: "Delete" | "Dispel";
  actionHandler: () => void;
  isInsideModal?: boolean;
}

const PromptModal: FunctionComponent<Props> = ({
  title,
  body,
  action,
  isInsideModal,
  onClose,
  actionHandler,
}) => {
  return (
    <BaseModal
      isInsideModal={isInsideModal}
      isExpanded={false}
      onClose={onClose}
      title={`${title}`}
    >
      <p className="mb-4">{body}</p>
      <div className="flex justify-end gap-3">
        <button className="outline-button" onClick={onClose}>
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
