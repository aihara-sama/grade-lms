import ArrowIcon from "@/components/icons/arrow-icon";
import SelectPopper from "@/components/poppers/select-popper";
import { useRef, useState, type FunctionComponent } from "react";

interface IItem {
  title: string;
  id: string;
}

interface IProps {
  label: string;
  items: IItem[];
  defaultItemId: string;
  useBottomSpacing?: boolean;
  useTopSpacing?: boolean;
  onChange: (item: IItem) => void;
  fullWidth?: boolean;
}

const Select: FunctionComponent<IProps> = ({
  label,
  items,
  defaultItemId,
  onChange,
  fullWidth,
  useBottomSpacing,
  useTopSpacing,
}) => {
  const [isItemsPopperOpen, setIsItemsPopperOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<IItem>(
    items.find(({ id }) => id === defaultItemId)
  );
  const boxElRef = useRef<HTMLDivElement>();
  return (
    <div className="relative">
      <div
        className={`relative border-[1px] border-solid flex items-center justify-between px-[12px] py-[8px] rounded-[5px] cursor-pointer bg-[white] [transition:0.2s] ${fullWidth ? "w-[100%]" : "w-[150px]"} ${useBottomSpacing ? "mb-2" : "mb-0"} ${
          useTopSpacing ? "mt-2" : "mt-0"
        } hover:bg-slate-100 active:bg-slate-200`}
        onClick={() => {
          setIsItemsPopperOpen((prev) => !prev);
        }}
        ref={boxElRef}
      >
        <div className="absolute -top-[12px] left-[4px] bg-[white] px-[4px] py-[0]">
          {label}
        </div>
        <div className="title">{selectedItem.title}</div>
        <ArrowIcon direction={isItemsPopperOpen ? "top" : "bottom"} />
      </div>
      <SelectPopper
        onChange={(item) => {
          setSelectedItem(item);
          onChange(item);
          setIsItemsPopperOpen(false);
        }}
        items={items}
        anhrolElRef={boxElRef}
        isOpen={isItemsPopperOpen}
        setIsOpen={setIsItemsPopperOpen}
      />
    </div>
  );
};

export default Select;
