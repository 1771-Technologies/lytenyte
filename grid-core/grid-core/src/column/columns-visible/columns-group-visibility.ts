import { columnEmptyKey } from "../column-empty-key.js";
import { columnIsEmpty } from "../column-is-empty.js";
import { columnsByPin } from "../columns-by-pin.js";
import type { ColumnLike } from "./columns-visible.js";

// We cast to string since we want to treat these symbols as strings for TypeScript's comparison
// purposes. The actual ids for the columns will be replaced in the function below, so these
// symbols will not escape this module
const RemoveSymbol = Symbol("Remove") as unknown as string;
const EmptySymbol = Symbol("Empty") as unknown as string;

/**
 * Determines which columns should be visible based on their group membership and visibility settings.
 * This function handles complex column grouping scenarios including nested groups, pinned columns,
 * and different visibility modes.
 *
 * The function processes columns in several phases:
 * 1. Adjusts visibility based on group collapse state and visibility rules
 * 2. Separates columns by pin location (start, center, end)
 * 3. Collapses redundant empty columns while maintaining group structure
 *
 * Visibility Rules:
 * - always-visible: Column is shown regardless of group state
 * - visible-when-closed: Column is shown only when a parent group is collapsed
 * - visible-when-open: Column is shown only when all parent groups are expanded
 *
 * @param columns - Array of columns to process
 * @param isGroupCollapsed - Function that returns whether a group (identified by its path) is collapsed
 * @param delimiter - String used to join group path segments into a unique group identifier
 *
 * @returns Array of visible columns with appropriate empty placeholders for collapsed groups
 *
 * @example
 * const visibleColumns = columnsGroupVisibility(
 *   myColumns,
 *   (groupId) => collapsedGroups.has(groupId),
 *   "/"
 * );
 */
export function columnsGroupVisibility<T extends ColumnLike>(
  columns: T[],
  isGroupCollapsed: (id: string) => boolean,
  delimiter: string,
) {
  const visibilityAdjustedColumns: T[] = [...columns];

  // Cache group collapse states to avoid redundant calculations
  const calculatedGroups = new Map<string, boolean>();

  // Process columns in reverse order to handle nested groups correctly
  for (let i = visibilityAdjustedColumns.length - 1; i >= 0; i--) {
    const column = columns[i];
    const visibility = column.groupVisibility ?? "visible-when-open";

    // Skip processing for ungrouped columns or those that are always visible
    if (!column.groupPath?.length || visibility === "always-visible") continue;

    const groupPath = column.groupPath;

    if (visibility === "visible-when-closed") {
      let remove = true;

      // Check each parent group's collapse state, starting from the most specific path
      // If any parent group is collapsed, we keep the column
      for (let groupIndex = 0; groupIndex < groupPath.length; groupIndex++) {
        const key = groupPath.slice(0, groupPath.length - groupIndex).join(delimiter);
        const isClosed = calculatedGroups.get(key) ?? isGroupCollapsed(key);
        calculatedGroups.set(key, isClosed);

        if (isClosed) {
          remove = false;
          break;
        }
      }

      // We only keep this column if the above loop found a closed parent group
      if (remove)
        visibilityAdjustedColumns[i] = { id: RemoveSymbol, pin: column.pin } as unknown as T;

      continue;
    }

    // For visible-when-open columns, we check each parent group
    // If any parent group is collapsed, replace the column with an empty placeholder
    // at the appropriate group level
    for (let j = 0; j < groupPath.length; j++) {
      const groupSlice = groupPath.slice(0, groupPath.length - j);
      const key = groupSlice.join(delimiter);

      const isClosed = calculatedGroups.get(key) ?? isGroupCollapsed(key);
      calculatedGroups.set(key, isClosed);

      if (visibility === "visible-when-open" && isClosed) {
        visibilityAdjustedColumns[i] = {
          id: EmptySymbol,
          groupPath: groupSlice,
          pin: column.pin,
        } as unknown as T;
      }
    }
  }

  // Process columns by pin section to maintain pin boundaries during collapse
  // This ensures that group collapsing doesn't cross pin boundaries
  const { start, center, end } = columnsByPin(visibilityAdjustedColumns);
  const collapsedStart = collapseColumns(start);
  const collapsedCenter = collapseColumns(center);
  const collapsedEnd = collapseColumns(end);

  const visible = [...collapsedStart, ...collapsedCenter, ...collapsedEnd];
  return visible;
}

/**
 * Processes a section of columns to collapse redundant empty columns while maintaining group structure.
 * This is a complex operation that ensures visual consistency when groups are collapsed.
 *
 * @param columns - Array of columns from a single pin section
 * @returns Processed array with redundant empty columns removed
 */
function collapseColumns<T extends ColumnLike>(columns: T[]) {
  const next: T[] = [];

  let count = 0;
  // First pass: Remove marked columns and consolidate empty columns
  // - Skip columns marked with RemoveSymbol
  // - Replace EmptySymbol columns with actual empty columns
  // - Ensure adjacent empty columns in the same group share the same id
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.id === RemoveSymbol) continue;
    else if (column.id === EmptySymbol) {
      const key = columnEmptyKey(column.groupPath!, column.pin ?? null);
      if (next[count - 1]?.id !== key) {
        next.push({ id: key, groupPath: column.groupPath, pin: column.pin } as T);
        count++;
      }
    } else {
      next.push(column);
      count++;
    }
  }

  let emptyCount = 0;
  const indicesToClear: Record<number, number[]> = {};

  // Second pass: Process empty columns to maintain group structure
  // For each empty column, we check:
  // 1. If it has any non-empty siblings at each group level
  // 2. Which level of empty column should be preserved
  // 3. Mark redundant group levels for removal
  for (let i = 0; i < next.length; i++) {
    const c = next[i];

    if (!columnIsEmpty(c) || !c.groupPath?.length) continue;

    (c as { id: string }).id = `${c.id}-${emptyCount}`;
    emptyCount++;

    const levelCount = c.groupPath.length;

    // Check each level of the group path for necessary empty columns
    for (let level = 0; level < levelCount; level++) {
      const key = c.groupPath[level];

      // Look backwards for non-empty siblings
      let groupHasChild = false;
      for (let col = i - 1; col >= 0; col--) {
        const left = next[col];
        if (!left.groupPath?.length) break;

        const leftKey = left.groupPath?.[level];

        if (leftKey !== key) break;

        if (!columnIsEmpty(left)) {
          groupHasChild = true;
          break;
        }
      }

      // Look forwards for non-empty siblings
      for (let col = i + 1; col < next.length && !groupHasChild; col++) {
        const right = next[col];
        if (!right.groupPath?.length) break;

        const rightKey = right.groupPath?.[level];

        if (rightKey !== key) break;

        if (!columnIsEmpty(right)) {
          groupHasChild = true;
          break;
        }
      }

      // If no non-empty siblings found, mark this level for removal
      if (!groupHasChild) {
        indicesToClear[i] ??= [];
        indicesToClear[i].push(level);
      }
    }
  }

  // Final pass: Clean up marked indices and remove empty group paths
  for (const [row, indices] of Object.entries(indicesToClear)) {
    const rowIndex = row as unknown as number;
    for (const i of indices) {
      next[rowIndex].groupPath![i] = undefined as unknown as string;
    }
    (next[rowIndex] as { groupPath: string[] }).groupPath = next[rowIndex].groupPath!.filter(
      (c) => c !== undefined,
    );
    if (!next[rowIndex].groupPath!.length)
      (next[rowIndex] as { groupPath: undefined | string[] }).groupPath = undefined;
  }

  return next;
}
