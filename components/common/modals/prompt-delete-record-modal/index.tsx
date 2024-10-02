import BaseModal from "@/components/common/modals/base-modal";
import DeleteIcon from "@/components/icons/delete-icon";
import LoadingSpinner from "@/components/loading-spinner";
import clsx from "clsx";
import { useState, type FunctionComponent } from "react";

interface Props {
  title: string;
  prompt: string;
  confirmText: string;
  record: string;
  isInsideModal?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const PromptDeleteRecordModal: FunctionComponent<Props> = ({
  confirmText,
  prompt,
  record,
  title,
  isInsideModal,
  onClose,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    await onConfirm();

    setIsSubmitting(false);
  };

  return (
    <BaseModal
      isInsideModal={isInsideModal}
      isFixedHeight={false}
      onClose={() => onClose()}
      title={title}
    >
      <div className="flex justify-center my-4">
        <DeleteIcon />
      </div>
      <p className="text-base text-center font-bold mx-16">{prompt}</p>
      <div className="flex justify-center mb-7" title={prompt}>
        &quot;
        <p className="text-center truncate">{record}</p>
        &quot;
      </div>
      <div className="flex justify-end gap-3">
        <button className="outline-button" onClick={onClose}>
          Cancel
        </button>
        <button className="delete-button" onClick={handleSubmit}>
          {isSubmitting && <LoadingSpinner />}
          <span className={`${clsx(isSubmitting && "opacity-0")}`}>
            {confirmText}
          </span>
        </button>
      </div>
    </BaseModal>
  );
};

export default PromptDeleteRecordModal;
