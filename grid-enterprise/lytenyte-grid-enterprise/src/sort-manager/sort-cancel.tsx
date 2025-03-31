import { useGrid } from "../use-grid";
import { useSortManagerContext } from "./sort-manager-context";
import { sortModelToSortItems } from "./sort-model-to-sort-items";

export function SortCancel() {
  const grid = useGrid();
  const [, setState] = useSortManagerContext();
  return (
    <button
      className="lng1771-sort-manager__button"
      onClick={() => {
        const model = grid.state.sortModel.peek();
        if (model.length) setState(sortModelToSortItems(model, grid));
        else setState([{ sortDirection: "ascending" }]);
      }}
    >
      Cancel
    </button>
  );
}
