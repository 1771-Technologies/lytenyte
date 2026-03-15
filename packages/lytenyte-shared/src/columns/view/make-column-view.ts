import type { ColumnAbstract } from "../../types.js";
import { columnAddMarker } from "../add-marker/column-add-marker.js";
import { columnAddRowGroup } from "../add-row-group/column-add-row-group.js";
import { view, type ViewArguments } from "./view.js";

interface MakeColumnViewArgs extends ViewArguments {
  readonly rowGroupDepth: number;
  readonly rowGroupTemplate: false | Omit<ColumnAbstract, "id">;
  readonly marker: Omit<ColumnAbstract, "id"> & { on?: boolean };
}

/**
 * The main entry point for building a column view. Before delegating to view, it conditionally
 * prepends the managed row group column and marker column to the column list based on the provided
 * configuration. The row group column is added when row grouping is active and a single-column
 * display mode is configured. The marker column is added when explicitly enabled.
 */
export function makeColumnView({
  columns,
  rowGroupDepth,
  rowGroupTemplate,
  marker,
  base,
  groupExpansionDefault,
  groupExpansions,
  groupJoinDelimiter,
  filledDepth,
  lastGroupShouldFill,
}: MakeColumnViewArgs) {
  const colsWithGroup = columnAddRowGroup({
    columns: columns,
    rowGroupDepth,
    rowGroupTemplate,
  });

  const colsWithMarker = columnAddMarker({
    columns: colsWithGroup,
    marker,
  });

  const columnView = view({
    columns: colsWithMarker,
    base,
    groupExpansionDefault,
    groupExpansions,
    groupJoinDelimiter,
    filledDepth,
    lastGroupShouldFill,
  });

  return columnView;
}
