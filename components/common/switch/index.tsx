import type { Dispatch, FunctionComponent, SetStateAction } from "react";

interface Props {
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
}
const Switch: FunctionComponent<Props> = ({ isChecked, setIsChecked }) => {
  return (
    <div
      className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
        isChecked ? "bg-link" : "bg-gray-300"
      }`}
      onClick={() => setIsChecked(!isChecked)}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          isChecked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </div>
  );
};

export default Switch;
