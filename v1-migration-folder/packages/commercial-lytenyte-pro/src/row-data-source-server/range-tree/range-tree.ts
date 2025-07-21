import type { TreeParent, TreeRoot } from "../async-tree/+types.async-tree";

/**
 * Represents a flattened range with start/end row indices and an associated path.
 */
export type FlattenedRange = {
  /** Starting row index (inclusive) */
  rowStart: number;
  /** Ending row index (exclusive) */
  rowEnd: number;
  /** Path identifier for this range */
  parent: TreeParent<any, any> | TreeRoot<any, any>;
};

/**
 * Represents a node in a range tree, containing a range and its nested child ranges.
 */
export interface RangeNode {
  /** The range associated with this node */
  range: FlattenedRange;
  /** Child nodes representing nested ranges within this range */
  children: RangeNode[];
}

/**
 * A tree structure for efficient nested range operations.
 *
 * Maintains a hierarchical representation of ranges where parent ranges contain their
 * child ranges. Provides methods for querying ranges that contain specific row indices.
 *
 * @remarks
 * The tree is constructed by:
 * 1. Sorting ranges by start index
 * 2. Using the first range as root
 * 3. Inserting subsequent ranges into their appropriate parent nodes
 *
 * @example
 * ```typescript
 * const ranges = [
 *   { rowStart: 0, rowEnd: 100, path: 'root' },
 *   { rowStart: 20, rowEnd: 50, path: 'child1' },
 *   { rowStart: 30, rowEnd: 40, path: 'grandchild' }
 * ];
 *
 * const tree = new RangeTree(ranges);
 * const rangesAtRow25 = tree.findRangesForRowIndex(25);
 * // Returns [root, child1]
 * ```
 */
export class RangeTree {
  /** Root node of the range tree */
  root: RangeNode;

  /**
   * Creates a new range tree from an array of flattened ranges.
   *
   * @param ranges - Array of ranges to organize into a tree structure
   */
  constructor(ranges: FlattenedRange[]) {
    const sortedRanges = ranges.toSorted((left, right) => left.rowStart - right.rowStart);

    const root = { range: sortedRanges[0], children: [] };
    for (let i = 1; i < sortedRanges.length; i++) {
      insert(root, sortedRanges[i]);
    }

    this.root = root;
  }

  /**
   * Finds all ranges that contain the specified row index.
   *
   * Traverses the tree from root to leaves, collecting all ranges that contain
   * the target index. Returns ranges in order from outermost to innermost.
   *
   * @param index - Row index to search for
   * @returns Array of ranges containing the index, ordered from outer to inner
   */
  findRangesForRowIndex(index: number): FlattenedRange[] {
    const ranges: FlattenedRange[] = [];

    let currentNode: RangeNode | undefined = this.root;

    while (currentNode) {
      if (index >= currentNode.range.rowStart && index < currentNode.range.rowEnd) {
        ranges.push(currentNode.range);

        currentNode = currentNode.children.find(
          (child) => index >= child.range.rowStart && index < child.range.rowEnd,
        );
      } else {
        break;
      }
    }

    return ranges;
  }
}

/**
 * Inserts a range into the appropriate position in the range tree.
 *
 * Recursively finds the most deeply nested existing range that contains the new range,
 * then adds the new range as a child of that node.
 *
 * @param node - Current node to check for insertion
 * @param range - Range to insert into the tree
 */
function insert(node: RangeNode, range: FlattenedRange) {
  // Check each child to see if it contains this range
  for (const child of node.children) {
    if (containsRange(child.range, range)) {
      insert(child, range);
      return;
    }
  }

  // If we get here, this node is the parent
  node.children.push({
    range,
    children: [],
  });
}

/**
 * Determines if one range fully contains another range.
 *
 * A range contains another range if its start index is less than or equal to
 * the inner range's start AND its end index is greater than or equal to
 * the inner range's end.
 *
 * @param outer - The potentially containing range
 * @param inner - The potentially contained range
 * @returns true if outer fully contains inner, false otherwise
 */
function containsRange(outer: FlattenedRange, inner: FlattenedRange): boolean {
  return outer.rowStart <= inner.rowStart && outer.rowEnd >= inner.rowEnd;
}
