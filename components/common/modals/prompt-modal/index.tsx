import BasicModal from "@/components/common/modals/basic-modal";
import clsx from "clsx";
import type { FunctionComponent } from "react";

interface Props {
  onClose: () => void;
  title: string;
  body: string;
  action: "Delete" | "Expel";
  actionHandler: () => void;
  isInsideModal?: boolean;
  isSubmitting: boolean;
}

const PromptModal: FunctionComponent<Props> = ({
  title,
  body,
  action,
  isInsideModal,
  isSubmitting,
  onClose,
  actionHandler,
}) => {
  return (
    <BasicModal
      isInsideModal={isInsideModal}
      isFixedHeight={false}
      onClose={() => onClose()}
      title={`${title}`}
    >
      <p className="mb-4">{body}</p>
      <div className="flex justify-end gap-3">
        <button className="outline-button" onClick={onClose}>
          Cancel
        </button>
        <button className="primary-button" onClick={actionHandler}>
          {isSubmitting && (
            <img
              className="loading-spinner"
              src="/assets/gif/loading-spinner.gif"
              alt=""
            />
          )}
          <span className={`${clsx(isSubmitting && "opacity-0")}`}>
            {action}
          </span>
        </button>
      </div>
    </BasicModal>
  );
};

export default PromptModal;
