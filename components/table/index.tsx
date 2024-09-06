import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import { isCloseToBottom } from "@/utils/is-document-close-to-bottom";
import clsx from "clsx";
import throttle from "lodash.throttle";
import type { FunctionComponent, ReactNode, UIEventHandler } from "react";
import { useCallback, useEffect, useState } from "react";

interface Props {
  data: { [key: string]: ReactNode }[];
  compact?: boolean;
  onSearchInputChange?: (search: string) => void;
  onScrollEnd?: (search: string) => void;
}

const Table: FunctionComponent<Props> = ({
  data,
  compact,
  onScrollEnd,
  onSearchInputChange,
}) => {
  const [searchText, setSearchText] = useState("");

  const keys = Object.keys(data[0] || {});

  const onScroll: UIEventHandler<HTMLDivElement> = useCallback(
    throttle((e) => {
      if (isCloseToBottom(e.target as HTMLElement)) onScrollEnd(searchText);
    }, 300),
    [searchText]
  );

  useEffect(() => {
    onSearchInputChange?.(searchText);
  }, [searchText]);

  if (!data.length) return null;

  return (
    <div className="flex-1 ">
      <Input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        Icon={<SearchIcon />}
        autoFocus
      />
      <div className="relative rounded-md border-2 border-neutral-100">
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
          <div
            className={clsx(compact && "overflow-auto h-[234px]")}
            onScroll={onScroll}
          >
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
    </div>
  );
};

export default Table;
