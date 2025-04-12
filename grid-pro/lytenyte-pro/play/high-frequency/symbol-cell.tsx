import { CellRendererParamsProReact } from "@1771technologies/lytenyte-pro/types";
import "./symbol-cell.css";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
/* eslint-disable @next/next/no-img-element */

export function GroupCell({ api, row }: CellRendererParamsProReact) {
  if (api.rowIsGroup(row)) {
    const symbol = row.pathKey;

    const isExpanded = api.rowGroupIsExpanded(row);

    return (
      <div className="flex items-center h-full w-full overflow-hidden text-nowrap gap-2 px-3">
        <button
          tabIndex={-1}
          className="hover:bg-[var(--lng1771-gray-30)] p-1 rounded"
          onClick={() => api.rowGroupToggle(row)}
        >
          {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </button>
        <div className="h-[32px] w-[32px] min-w-[32px] min-h-[32px] rounded-full overflow-hidden items-center justify-center flex">
          <img
            src={`/symbols/${symbol}.png`}
            alt=""
            className="bg-black rounded-full p-1 min-h-[26px] min-w-[26] w-[26px] h-[26px]"
          />
        </div>
        <div className="flex items-center justify-center bg-teal-600/20 px-1 py-0.5 rounded-2xl symbol-cell text-xs min-w-[60px]">
          {symbol}
        </div>
      </div>
    );
  }
  if (!api.rowIsLeaf(row)) return null;

  const symbol = row.data["symbol"] as string;

  return (
    <div className="flex items-center justify-end h-full w-full overflow-hidden text-nowrap gap-3 px-3">
      <div className="flex items-center justify-center px-1 py-0.5 rounded-2xl symbol-cell text-xs min-w-[60px] opacity-50">
        {symbol}
      </div>
    </div>
  );
}
