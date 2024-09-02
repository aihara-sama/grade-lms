import clsx from "clsx";
import { type FunctionComponent, type ReactNode } from "react";

interface Props {
  data: { [key: string]: ReactNode }[];
  compact?: boolean;
}

const Table: FunctionComponent<Props> = ({ data, compact }) => {
  if (!data.length) return null;

  const keys = Object.keys(data[0] || {});

  return (
    <div className="relative rounded-md flex-1 border-2 border-neutral-100 ">
      <div className="flex flex-col">
        <div className="flex gap-3 px-4 py-3 font-bold bg-gray-200 rounded-md">
          {keys.map((key) => (
            <div
              className="text-sm flex-1 whitespace-nowrap overflow-ellipsis overflow-hidden first-of-type:flex-[2] last-of-type:flex-[3]"
              key={key}
            >
              {key}
            </div>
          ))}
        </div>
        <div className={clsx(compact && "overflow-auto h-[280px]")}>
          <div className="p-2">
            {data.map((row, idx) => (
              <div key={idx} className="flex items-center gap-3 px-3 py-1">
                {keys.map((key, i) => (
                  <div
                    className="flex-1 whitespace-nowrap overflow-ellipsis overflow-hidden first-of-type:flex-[2] last-of-type:flex-[3] last-of-type:flex last-of-type:justify-end last-of-type:overflow-visible"
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
    </div>
  );
};

export default Table;
