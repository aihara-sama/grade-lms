import type { PropsWithClassName } from "@/types/props.type";
import { isCloseToBottom } from "@/utils/DOM/is-document-close-to-bottom";
import clsx from "clsx";
import type { FunctionComponent, ReactNode, UIEventHandler } from "react";
import { memo } from "react";

interface Props {
  data: { [key: string]: ReactNode }[];
  compact?: boolean;
  onScrollEnd?: () => void;
}

const Table: FunctionComponent<PropsWithClassName<Props>> = memo(
  function Table({ data, compact, className = "", onScrollEnd }) {
    const keys = Object.keys(data[0] || {});

    const onScroll: UIEventHandler<HTMLDivElement> = (e) => {
      if (isCloseToBottom(e.target as HTMLElement)) onScrollEnd?.();
    };

    if (!data.length) return null;

    return (
      <div className={`flex-1 flex flex-col overflow-auto ${className}`}>
        <div
          className={`flex-1 flex flex-col ${clsx(!compact && "min-w-[352px]")}`}
        >
          <div
            className={`relative ${clsx(!compact && "")} rounded-md border-2 border-neutral-100 flex-1 flex flex-col`}
          >
            <div className="flex flex-col flex-1">
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
              <div
                className={clsx(compact && "overflow-auto h-[222px]")}
                onScroll={onScroll}
              >
                <div className="p-2">
                  {data.map((row, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-3 py-1"
                    >
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
        </div>
      </div>
    );
  }
);

export default Table;
