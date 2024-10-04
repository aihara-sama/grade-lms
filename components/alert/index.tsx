import CloseIcon from "@/components/icons/close-icon";
import type { FunctionComponent, PropsWithChildren } from "react";

interface Props {
  onClose: () => any;
}

const Alert: FunctionComponent<PropsWithChildren<Props>> = ({
  children,
  onClose,
}) => {
  return (
    <div className="flex gap-2 items-center justify-between p-2 px-4 rounded-sm bg-yellow-300">
      <div className="w-full">{children}</div>
      <div className="p-2 inter-active">
        <CloseIcon onClick={onClose} />
      </div>
    </div>
  );
};

export default Alert;
