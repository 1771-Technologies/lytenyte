import "./sort-manager.css";
import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { useSortableColumnItems } from "./use-sortable-column-items";
import { useSortState, type SortItem } from "./use-sort-state";
import { useMemo } from "react";
import { Dropdown } from "../../components-internal/dropdown/dropdown";
import { Separator } from "../../components-internal/separator";
import { sortModelToSortItems } from "./sort-model-to-sort-items";
import { sortItemsToSortModel } from "./sort-items-to-sort-model";
import { CrossIcon, PlusIcon } from "@1771technologies/lytenyte-grid-community/icons";
import { Button } from "../../components-internal/button/button";

export interface SortDeleteComponentProps {
  onDelete: () => void;
}

export interface SortAddComponentProps {
  onAdd: () => void;
  disabled: boolean;
  disableReason: string;
}

export interface SortManagerProps<D> {
  readonly grid: StoreEnterpriseReact<D>;

  readonly onCancel?: () => void;
  readonly onApply?: () => void;
  readonly onAdd?: () => void;
  readonly onDelete?: () => void;
}

export function SortManager<D>({ grid, onCancel, onApply, onAdd, onDelete }: SortManagerProps<D>) {
  const columnItems = useSortableColumnItems(grid);

  const [state, setState] = useSortState(grid);

  const unselectedSortedColumns = useMemo(() => {
    const selected = new Set(state.map((c) => c.columnId).filter((c) => c != null));

    return columnItems.filter((c) => !selected.has(c.value));
  }, [columnItems, state]);

  if (columnItems.length === 0) {
    return <div className="lng1771-sort-manager__empty">There are no sortable columns.</div>;
  }

  const maxSortCount = columnItems.length;

  return (
    <div className="lng1771-sort-manager">
      <div className="lng1771-sort-manager__sort-list-container">
        <div className="lng1771-sort-manager__sort-list">
          {/* LABEL SECTION */}
          <div className="lng1771-sort-manager__sort-labels">
            <div className="lng1771-sort-manager__sort-labels--column">Column</div>
            <div className="lng1771-sort-manager__sort-labels--on">Sort on</div>
            <div className="lng1771-sort-manager__sort-labels--order">Order</div>
          </div>

          {/* SORT SECTION */}
          {state.map((c, i) => {
            const columnItem = columnItems.find((s) => c.columnId === s.value) ?? null;

            return (
              <div key={i} className="lng1771-sort-manager__sort-item">
                <Dropdown
                  items={
                    columnItem ? [columnItem, ...unselectedSortedColumns] : unselectedSortedColumns
                  }
                  onSelect={(column) => {
                    setState((prev) => {
                      const v = { ...prev[i] };
                      v.columnId = column?.value;
                      const next = [...prev];
                      next.splice(i, 1, v);

                      return next;
                    });
                  }}
                  selected={columnItem}
                  placeholder="Sort by"
                />
                <Dropdown
                  items={sortValuesValues}
                  selected={sortValuesValues.find((v) => v.value === c.sortOn) ?? null}
                  onSelect={(sortOn) => {
                    if (!sortOn) return;
                    setState((prev) => {
                      const v = { ...prev[i] };
                      v.sortOn = sortOn!.value as SortItem["sortOn"];
                      const next = [...prev];

                      next.splice(i, 1, v);
                      return next;
                    });
                  }}
                  placeholder="Select..."
                />
                <Dropdown
                  items={sortDirectionValues}
                  onSelect={(item) => {
                    if (!item) return;
                    setState((prev) => {
                      const v = { ...prev[i] };
                      v.sortDirection = item!.value as SortItem["sortDirection"];
                      const next = [...prev];
                      next.splice(i, 1, v);

                      return next;
                    });
                  }}
                  selected={
                    c.sortDirection === "ascending"
                      ? { label: "Asc", value: "ascending" }
                      : { label: "Desc", value: "descending" }
                  }
                  placeholder=""
                />
                <div className="lng1771-sort-manager__sort-item-controls">
                  <button
                    onClick={() => {
                      setState((prev) => {
                        const next = [...prev];
                        next.splice(i, 1);

                        if (!next.length) {
                          return [{ sortDirection: "ascending" }];
                        }

                        return next;
                      });
                      onDelete?.();
                    }}
                    className="lng1771-sort-manager__sort-item-controls--delete"
                  >
                    <CrossIcon width={20} height={20} />
                  </button>
                  <button
                    disabled={maxSortCount <= state.length}
                    onClick={() => {
                      setState((prev) => {
                        const next = [...prev];
                        next.splice(i + 1, 0, { sortDirection: "ascending" });
                        return next;
                      });
                      onAdd?.();
                    }}
                    className="lng1771-sort-manager__sort-item-controls--add"
                  >
                    <PlusIcon width={20} height={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Separator dir="horizontal" style={{ gridColumn: "-1 / 1" }} />
      {/* Controls */}
      <div className="lng1771-sort-manager__sort-controls">
        <Button
          kind="secondary"
          onClick={() => {
            const model = grid.state.sortModel.peek();
            if (model.length) setState(sortModelToSortItems(model, grid));
            else setState([{ sortDirection: "ascending" }]);

            onCancel?.();
          }}
          className="lng1771-sort-manager__sort_cancel"
        >
          Cancel
        </Button>
        <Button
          kind="primary"
          onClick={() => {
            grid.state.sortModel.set(sortItemsToSortModel(state));

            onApply?.();
          }}
          className="lng1771-sort-manager__sort_apply"
        >
          Apply
        </Button>
      </div>
    </div>
  );
}

const sortValuesValues = [
  { label: "Values", value: "values" },
  { label: "Absolute", value: "values_absolute" },
  { label: "Accented", value: "values_accented" },
  { label: "Nulls First", value: "values_nulls_first" },
  { label: "Absolute Nulls First", value: "values_absolute_nulls_first" },
  { label: "Accented Nulls First", value: "values_accented_nulls_first" },
];
const sortDirectionValues = [
  { label: "Asc", value: "ascending" },
  { label: "Desc", value: "descending" },
];
