import "./header-cell-default.css";
import { clsx } from "@1771technologies/js-utils";
import type { ColumnHeaderRendererParamsProReact } from "../types";
import { MoreDotsIcon, SortAscending, SortDescending } from "../icons";

export function HeaderCellDefault({ column, api }: ColumnHeaderRendererParamsProReact) {
  const sx = api.getState();

  const isSortable = api.columnIsSortable(column);

  const sortModel = sx.sortModel.use();

  const currentSort = api.columnSortDirection(column);
  const currentSortIndex = api.columnSortModelIndex(column);
  const nextSort = api.columnSortGetNext(column);
  const displaySortNumber = sortModel.length > 0 && currentSortIndex > 0;

  const hints = column.uiHints ?? sx.columnBase.peek().uiHints ?? {};

  const columnMenuOpen = sx.columnMenuActiveColumn.use();

  const hasControls = hints.columnMenu || (hints.sortButton && isSortable);

  return (
    <div
      className={clsx(
        "lng1771-header-default",
        column.type === "number" && "lng1771-header-default--end-align",
        column.type !== "number" && "lng1771-header-default--start-align",
      )}
    >
      <div>{column.headerName ?? column.id}</div>
      {hasControls && (
        <div className="lng1771-header-default__controls">
          {isSortable && hints.sortButton && (
            <button
              tabIndex={-1}
              data-active={currentSort != null}
              className={clsx("lng1771-header-default__button")}
              onClick={() => api.columnSortCycleToNext(column)}
            >
              {currentSort === "asc" && <SortAscending width={16} height={16} />}
              {currentSort === "desc" && <SortDescending width={16} height={16} />}
              {!currentSort && nextSort?.includes("asc") && (
                <SortAscending width={16} height={16} />
              )}
              {!currentSort && nextSort?.includes("desc") && (
                <SortDescending width={16} height={16} />
              )}
              {displaySortNumber && currentSortIndex > 0 && (
                <span className="lng1771-header-default__sort-count">{currentSortIndex + 1}</span>
              )}
            </button>
          )}

          {hints.columnMenu && (
            <button
              tabIndex={-1}
              className="lng1771-header-default__button"
              onFocus={(ev) => {
                if (column !== columnMenuOpen) return;
                ev.currentTarget.parentElement?.parentElement?.parentElement?.focus();
              }}
              data-active={column === columnMenuOpen}
              onClick={(e) => api.columnMenuOpen(column, e.currentTarget)}
            >
              <MoreDotsIcon width={16} height={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
