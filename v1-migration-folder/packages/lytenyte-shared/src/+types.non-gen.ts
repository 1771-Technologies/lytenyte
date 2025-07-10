export interface ColumnWidthItem {
  readonly width?: number;
  readonly widthMin?: number;
  readonly widthMax?: number;
  readonly widthFlex?: number;
}

export type RowHeight = number | ((i: number) => number) | "auto" | `fill:${number}`;

export type Row = number;
export type Column = number;
export type RowSpan = number;
export type ColSpan = number;
export type Empty = 0;
export type RowColTuple = [RowSpan, ColSpan] | [Empty, Row, Column];

export interface SpanLayout {
  readonly rowTopStart: Row;
  readonly rowTopEnd: Row;
  readonly rowCenterStart: Row;
  readonly rowCenterEnd: Row;
  readonly rowCenterLast: Row;
  readonly rowBotStart: Row;
  readonly rowBotEnd: Row;

  readonly colStartStart: Column;
  readonly colStartEnd: Column;
  readonly colCenterStart: Column;
  readonly colCenterEnd: Column;
  readonly colCenterLast: Column;
  readonly colEndStart: Column;
  readonly colEndEnd: Column;
}

export type SpanFn = (r: Row, c: Column) => number;
export type RowPredicate = (r: Row) => boolean;

/**
 * The layout map represents the current computed layout of the rows and columns
 * in the grid. It primarily identifies full width rows, and cells that span more
 * than a single column.
 *
 * Reading the data of the map can be a bit tricky but it works as follows:
 * - The root map is a key value lookup. The key is the row index and the value is the layout
 *   for that row.
 * - The layout for the row is another map. The map can be one of two types:
 *     - A full width map (we should test for this by testing the map === FULL_WIDTH_MAP)
 *     - Or a tuple of 2-3 numbers. If the tuple has 2 numbers it contains the span of the column.
 *       If the tuple has 3 numbers, it contains an empty cell, and the second and third index is the root
 *       row and column index of that cell.
 */
export type LayoutMap = Map<Row, Map<Column, RowColTuple>>;

export type ScrollIntoViewFn = (p: { row?: number; column?: number; behavior: "instant" }) => void;
