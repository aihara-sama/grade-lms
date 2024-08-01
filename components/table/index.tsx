import type { FunctionComponent } from "react";

interface IProps {
  rows: React.ReactNode[][];
  titles: string[];
  useFullWidth?: boolean;
}

const Table: FunctionComponent<IProps> = ({ rows, titles, useFullWidth }) => {
  return (
    <div className="min-h-[430px] overflow-auto border border-gray-200">
      <table
        className={`w-full rounded-[5px] [border-spacing:0] pb-[12px] overflow-auto min-w-[${useFullWidth ? "100%" : "700px"}]`}
      >
        <thead>
          <tr className="bg-gray-200">
            {titles.map((title, idx) => (
              <th className="px-[22px] py-[14px]" key={idx}>
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr className="text-left text-sm" key={idx}>
              {row.map((cell, i) => (
                <td
                  className="px-[22px] py-[10px] max-w-0 whitespace-nowrap overflow-ellipsis overflow-hidden"
                  key={i}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
