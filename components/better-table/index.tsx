import { type FunctionComponent, type ReactNode } from "react";

interface IProps {
  data: { [key: string]: ReactNode }[];
}

const BetterTable: FunctionComponent<IProps> = ({ data }) => {
  if (!data.length) return null;

  const keys = Object.keys(data[0]);

  return (
    <div className="relative border border-gray-200">
      <div className="min-h-[430px] overflow-auto flex flex-col">
        <div className="flex gap-[12px] px-[16px] py-[12px] font-bold bg-gray-200">
          {keys.map((key) => (
            <div
              className="text-sm flex-[1] whitespace-nowrap overflow-ellipsis overflow-hidden first-of-type:flex-[2] last-of-type:flex-[3]"
              key={key}
            >
              {key}
            </div>
          ))}
        </div>
        <div className="p-[16px] flex flex-col gap-[6px]">
          {data.map((row, idx) => (
            <div
              key={idx}
              className="flex items-center gap-[12px] px-[10px] py-[6px]  hover:bg-gray-200"
            >
              {keys.map((key, i) => (
                <div
                  className=" flex-[1] whitespace-nowrap overflow-ellipsis overflow-hidden first-of-type:flex-[2] last-of-type:flex-[3]"
                  key={i}
                >
                  {row[key]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BetterTable;
