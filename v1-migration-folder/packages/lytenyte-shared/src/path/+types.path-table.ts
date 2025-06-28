/*
Copyright 2025 1771 Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/** Base definition for a path object. The optional joinId is used to determine how paths are joined. */
export type PathProvidedItemObject = { id: string; joinId?: string };

/**
 * The provided type of a path column. The groupPath is used to determine the hierarchical relationship
 * between items in the path structure.
 */
export interface PathProvidedItem<T extends PathProvidedItemObject = PathProvidedItemObject> {
  /**
   * A unique identifier for the column. Does not have to be unique for the path functions,
   * but typically should be for most practical applications.
   */
  readonly id: string;
  /**
   * An array of strings or path objects that define the column's relationship in the hierarchy.
   * Each element represents a level in the hierarchical structure.
   */
  readonly groupPath?: (T | string)[];
}

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
 * The PathMatrix type represents a joined path hierarchy. A path matrix is a symmetric MxN
 * matrix where M is the number of columns and N is the maximum group path length. The hierarchy
 * represents a table of items joined by their `groupPath` values.
 *
 * Each cell can either contain a PathMatrixItem or null (when there's no item at that position).
 */
export type PathMatrix = (PathMatrixItem | null)[][];

/**
 * The root object of a path tree. Every path tree returns this as the starting point of the tree.
 * It serves as the container for all top-level nodes in the hierarchy.
 */
export interface PathRoot<T extends PathProvidedItem = PathProvidedItem> {
  /** The type discriminant that identifies this as a root node */
  readonly kind: "root";
  /**
   * The children items in the path tree at the root level.
   * Maps from child identifier to the corresponding branch or leaf node.
   */
  readonly children: Map<string, PathBranch<T> | PathLeaf<T>>;
}

/**
 * The leaf object of a path tree. No further children may be defined from this point.
 * Represents a terminal node in the path hierarchy.
 */
export interface PathLeaf<T extends PathProvidedItem = PathProvidedItem> {
  /** The type discriminant that identifies this as a leaf node */
  readonly kind: "leaf";
  /**
   * The data associated with the leaf node.
   * It will be the original provided path item used for tree construction.
   */
  readonly data: T;
  /**
   * The parent node for the leaf, or the root node if the leaf has no parent.
   * Establishes the hierarchical relationship.
   */
  readonly parent: PathBranch<T> | PathRoot<T>;
}

/**
 * The branch object of a path tree - representing a point where paths are grouped
 * under a common path route. Branches contain both the grouping information and
 * references to their children.
 */
export interface PathBranch<T extends PathProvidedItem = PathProvidedItem> {
  /** The type discriminant that identifies this as a branch node */
  readonly kind: "branch";

  /** A unique identifier for this node*/
  readonly id: string;
  /**
   * The matrix item associated with this branch node.
   * Contains the original matrix item describing the path and its position.
   */
  readonly data: PathMatrixItem;
  /**
   * The parent node for the branch, or the root node if the branch has no parent.
   * Establishes the hierarchical relationship.
   */
  readonly parent: PathBranch<T> | PathRoot<T>;
  /**
   * The leaf and branch nodes that are children of the current branch.
   * This collection will not be empty for valid branch nodes.
   */
  readonly children: Map<string, PathBranch<T> | PathLeaf<T>>;
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

/**
 * Represents the complete path table structure with its contents and dimensions.
 * This is the final output of the `computePathTable` function and contains all
 * the information needed to render the hierarchical table.
 */
export interface PathTable<T extends PathProvidedItem> {
  /**
   * Two-dimensional array containing all table items arranged by row and column.
   * Each item includes positioning information for rendering.
   */
  readonly table: PathTableItem<T>[][];
  /**
   * Maximum number of rows in the table.
   * Used for layout calculations and rendering.
   */
  readonly maxRow: number;
  /**
   * Maximum number of columns in the table.
   * Used for layout calculations and rendering.
   */
  readonly maxCol: number;
}
