import BasicModal from "@/components/common/modals/basic-modal";
import DeleteIcon from "@/components/icons/delete-icon";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import clsx from "clsx";
import { useState, type FunctionComponent } from "react";

interface Props {
  title: string;
  prompt: string;
  confirmText: string;
  isInsideModal?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const PromptDeleteRecordsModal: FunctionComponent<Props> = ({
  isInsideModal,
  onClose,
  onConfirm,
  prompt,
  title,
  confirmText,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    await onConfirm();

    setIsSubmitting(false);
  };

  return (
    <BasicModal
      isInsideModal={isInsideModal}
      isFixedHeight={false}
      onClose={() => onClose()}
      title={title}
    >
      <div className="flex justify-center my-4">
        <DeleteIcon />
      </div>
      <p className="text-base text-center font-bold mx-16 mb-4">{prompt}</p>
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
    </BasicModal>
  );
};

export default PromptDeleteRecordsModal;
