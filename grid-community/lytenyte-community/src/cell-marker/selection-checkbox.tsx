import type { ApiCommunityReact } from "@1771technologies/grid-types";
import type { RowNode } from "@1771technologies/grid-types/community";
import { useMemo } from "react";
import { Checkbox } from "../components/checkbox";
import { handleRowSelection } from "../renderer/cell/utils/handle-row-selection";

export function SelectionCheckbox({
  api,
  row,
}: {
  api: ApiCommunityReact<any>;
  row: RowNode<any>;
}) {
  const sx = api.getState();
  const isSelect = sx.rowSelectionPredicate.use();

  const isSelectable = useMemo(() => {
    return isSelect === "all"
      ? true
      : isSelect === "leaf-only"
        ? api.rowIsLeaf(row)
        : isSelect === "group-only"
          ? api.rowIsGroup(row)
          : isSelect({ api, row });
  }, [api, isSelect, row]);

  const displayMode = sx.rowSelectionCheckbox.use();
  const selectedIds = sx.rowSelectionSelectedIds.use();

  if (displayMode === "hide" || (!isSelectable && displayMode === "hide-for-disabled")) return null;

  const isChecked = selectedIds.has(row.id);
  const isIndeterminate = api.rowSelectionIsIndeterminate(row.id);

  return (
    <Checkbox
      tabIndex={-1}
      isChecked={isChecked || isIndeterminate}
      isDeterminate={isIndeterminate}
      onClick={(event) => {
        handleRowSelection(api, row, event.shiftKey, true, true);
      }}
    />
  );
}
