import "./header-cell-default.css";
import { clsx } from "@1771technologies/js-utils";
import type { ColumnHeaderRendererParamsProReact } from "../types";
import { SortAscending, SortDescending } from "../icons";

export function HeaderCellDefault({ column, api }: ColumnHeaderRendererParamsProReact) {
  const sx = api.getState();

  const isSortable = api.columnIsSortable(column);

  const sortModel = sx.sortModel.use();

  const currentSort = api.columnSortDirection(column);
  const currentSortIndex = api.columnSortModelIndex(column);
  const nextSort = api.columnSortGetNext(column);
  const displaySortNumber = sortModel.length > 0 && currentSortIndex > 0;

  return (
    <div
      className={clsx(
        "lng1771-header-default",
        column.type === "number" && "lng1771-header-default--end-align",
        column.type !== "number" && "lng1771-header-default--start-align",
      )}
    >
      <div>{column.headerName ?? column.id}</div>
      {isSortable && (
        <button
          tabIndex={-1}
          data-sort-active={currentSort != null}
          className={clsx("lng1771-header-default__button")}
          onClick={() => api.columnSortCycleToNext(column)}
        >
          {currentSort === "asc" && <SortAscending width={16} height={16} />}
          {currentSort === "desc" && <SortDescending width={16} height={16} />}
          {!currentSort && nextSort?.includes("asc") && <SortAscending width={16} height={16} />}
          {!currentSort && nextSort?.includes("desc") && <SortDescending width={16} height={16} />}
          {displaySortNumber && currentSortIndex > 0 && (
            <span className="lng1771-header-default__sort-count">{currentSortIndex + 1}</span>
          )}
        </button>
      )}
    </div>
  );
}
