import { useGrid } from "../use-grid";
import { sortItemsToSortModel } from "./sort-items-to-sort-model";
import { useSortManagerContext } from "./sort-manager-context";

export function SortApply() {
  const grid = useGrid();
  const [state] = useSortManagerContext();
  return (
    <button
      className="lng1771-sort-manager__button"
      onClick={() => {
        grid.state.sortModel.set(sortItemsToSortModel(state));
      }}
    >
      Apply
    </button>
  );
}
