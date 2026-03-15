import type { ColumnAbstract } from "../types";

/**
 * A matrix item containing information about the position in hierarchy.
 * Created by the `computePathMatrix` function during path processing.
 */
export interface PathMatrixItem {
  /**
   * An identifier of a matrix node. This will be the path relationship joined by "#" characters.
   * This id will not be unique when there are multiple non-adjacent paths with the same value.
   */
  readonly id: string;
  /**
   * A unique identifier of a matrix node. This id will be unique across all matrix items.
   * It is the joined path relation plus an additional occurrence count.
   * The id is joined using "#" characters.
   */
  readonly idOccurrence: `${string}${string}${number}`;
  /**
   * The identifier used for joining the columns into a matrix item.
   * This id will be the `joinPath` elements joined by "#" characters.
   */
  readonly joinId: string;
  /**
   * The group path items used for creating the id. This will be the same as join path,
   * unless the original column's group path value specified an alternative join id.
   */
  readonly groupPath: string[];
  /**
   * The separated path items used for the joining relationship in the matrix.
   * These determine how columns are grouped together.
   */
  readonly joinPath: string[];
  /**
   * The ids of matrix items that are in this matrix join. This will have more than one id
   * when different paths are joined together using overriding join ids.
   */
  readonly idsInNode: Set<string>;
  /**
   * The column start position of the matrix node in the overall table structure.
   */
  readonly start: number;
  /**
   * The column end position of the matrix node in the overall table structure.
   */
  readonly end: number;
}

/**
 * The provided type of a path column. The groupPath is used to determine the hierarchical relationship
 * between items in the path structure.
 */
export interface PathProvidedItem {
  /**
   * A unique identifier for the column. Does not have to be unique for the path functions,
   * but typically should be for most practical applications.
   */
  readonly id: string;
  /**
   * An array of strings or path objects that define the column's relationship in the hierarchy.
   * Each element represents a level in the hierarchical structure.
   */
  readonly groupPath?: string[];
}

/**
 * The terminal table item in a path table. This represents the original column
 * of the path item and contains positioning information for rendering.
 */
export interface PathTableLeaf<T extends PathProvidedItem> {
  /** The type discriminant that identifies this as a leaf table cell */
  readonly kind: "leaf";
  /**
   * The row start position of the table cell. This will be a value different from the max row
   * start when the leaf cell has to fill space in the hierarchy due to asymmetric group paths.
   */
  readonly rowStart: number;
  /**
   * The column start position of the cell. This is always the position of the cell
   * in the original path array used in `computePathTable`.
   */
  readonly colStart: number;
  /**
   * The number of rows this cell should span. It will be more than one if the cell has to
   * fill in for rows when the group hierarchy has gaps or asymmetric paths.
   */
  readonly rowSpan: number;
  /**
   * The number of columns this cell should span.
   * It will always be one for a table leaf cell.
   */
  readonly colSpan: number;
  /**
   * The original data associated with this table leaf cell.
   * Contains the user-provided path item.
   */
  readonly data: T;
}

/**
 * Represents a group cell in the path table. Group cells span multiple columns
 * and represent a grouping of related items in the hierarchy.
 */
export interface PathTableGroup {
  /** The type discriminant that identifies this as a group table cell */
  readonly kind: "group";
  /**
   * The row start position of the group cell in the table.
   * Determines where the group begins vertically.
   */
  readonly rowStart: number;
  /**
   * The column start position of the group cell in the table.
   * Determines where the group begins horizontally.
   */
  readonly colStart: number;
  /**
   * The number of rows this group cell spans.
   * Group cells typically span one row, but can span more in complex hierarchies.
   */
  readonly rowSpan: number;
  /**
   * The number of columns this group cell spans.
   * This is determined by how many leaf columns are grouped under this cell.
   */
  readonly colSpan: number;
  /**
   * The matrix item data associated with this group cell.
   * Contains information about the group's position and relationships.
   */
  readonly data: PathMatrixItem;
}

/**
 * Union type representing either a leaf or group item in the path table.
 * Used to type the elements in the final table structure.
 */
export type PathTableItem<T extends PathProvidedItem> = PathTableLeaf<T> | PathTableGroup;

export interface ColumnGroupMeta {
  /**
   * A map that gives all the group IDs that a given column is a part of.
   * For example:
   * ```ts
   * const column = { id: "x", groupPath: ["A", "B", "C" ] };
   * meta.colIdToGroupIds.get("x") // ["A", "A>B", "A>B>C"]
   * ```
   */
  readonly colIdToGroupIds: Map<string, string[]>;
  /**
   * A map that gives all the occurrence-qualified group IDs that a given column is a part of.
   * Occurrence IDs distinguish separate runs of the same group name (e.g. two non-adjacent blocks
   * of columns sharing the same groupPath). The run index is appended using the groupJoinDelimiter.
   * For example, if "A" appears in two separate runs:
   * ```ts
   * meta.colIdToOccurrenceGroupIds.get("col-in-first-run")  // ["A>0"]
   * meta.colIdToOccurrenceGroupIds.get("col-in-second-run") // ["A>1"]
   * ```
   */
  readonly colIdToOccurrenceGroupIds: Map<string, string[]>;
  /**
   * A set containing all the valid column group IDs. This can be used to either get all the
   * possible IDs, or check if an ID is valid. Note that these are the groupPath IDs, joined
   * by the `groupJoinDelimiter` used to create the column groups.
   */
  readonly validGroupIds: Set<string>;
  /**
   * A map where the key is the occurrence-qualified group ID and the value is a boolean indicating
   * if that group occurrence can be expanded and collapsed, or if it is always open. Each
   * contiguous run of the same group is evaluated independently, so two runs of the same group
   * name may have different collapsibility.
   */
  readonly groupIsCollapsible: Map<string, boolean>;
}

export interface ColumnView {
  /**
   * The column group metadata. This is mainly used internally by LyteNyte Grid, but can
   * be useful for external use cases where you need to determine if a column group is
   * expandable, or if you want to get all the column group ids.
   */
  meta: ColumnGroupMeta;
  /**
   * The maximum number of rows in the combined view. This equals the deepest column group
   * hierarchy depth plus one (for the leaf row). Used to determine how many header rows
   * to render.
   */
  maxRow: number;
  /**
   * The total number of visible columns across all pin sections (start, center, and end).
   */
  maxCol: number;
  /**
   * The 2D path table used to render the column headers. Each inner array is a row, and each
   * element is either a group cell (spanning multiple columns) or a leaf cell (a single column).
   * Rows are ordered from the outermost group level down to the leaf row.
   */
  combinedView: PathTableItem<ColumnAbstract>[][];
  /**
   * The ordered list of columns that are currently visible, after applying hide flags and
   * group expansion state. Columns are ordered: pinned start, center, pinned end.
   */
  visibleColumns: ColumnAbstract[];
  /**
   * A map from column ID to column definition for all columns (including hidden ones).
   * Useful for looking up a column's full definition by its ID.
   */
  lookup: Map<string, ColumnAbstract>;
  /**
   * The number of visible columns pinned to the start (left) of the grid.
   */
  startCount: number;
  /**
   * The number of visible columns pinned to the end (right) of the grid.
   */
  endCount: number;
  /**
   * The number of visible unpinned columns in the center of the grid.
   */
  centerCount: number;
}
