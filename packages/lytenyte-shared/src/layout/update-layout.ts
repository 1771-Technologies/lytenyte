import { clamp } from "@1771technologies/lytenyte-js-utils";
import type { RowPredicate, SpanFn } from "../+types.non-gen";

type RowIndex = number;
type ColIndex = number;
export const FULL_WIDTH = 1;
export const CONTAINS_DEAD_CELLS = 2;

// uint32
// kind | row span, col span | root row, root col | dead cells...

// The index is the row index, and the value
export type Computed = Uint8Array;
export type LayoutDiffers = Uint8Array;
export type Lookup = Map<RowIndex, Int32Array>;
export type DeadCells = Map<number, Uint8Array>;
export type RootCellLookup = Map<RowIndex, Map<ColIndex, [rowIndex: number, colIndex: number]>>;
export type SpanLookup = Map<RowIndex, Map<ColIndex, [rowSpan: number, colSpan: number]>>;

export interface UpdateLayoutArgs {
  readonly computed: Computed;
  readonly special: LayoutDiffers;
  readonly lookup: Lookup;
  readonly base: Uint32Array;

  readonly rowStart: number;
  readonly rowEnd: number;

  readonly isRowCutoff: RowPredicate;

  // Invalidate the layout cache whenever these change
  readonly computeColSpan: SpanFn | null;
  readonly computeRowSpan: SpanFn | null;
  readonly isFullWidth: RowPredicate | null;
  readonly rowScanDistance: number;

  readonly topCount: number;
  readonly botCount: number;
  readonly startCount: number;
  readonly endCount: number;
  readonly centerCount: number;
  readonly rowMax: number;
}

export function updateLayout(p: UpdateLayoutArgs): void {
  // If there are no row spans, or column spans, or full width rows then the layout is standard and there
  // is no work to do. We can skip it all.
  if (p.computeColSpan == null && p.computeRowSpan == null && p.isFullWidth == null) {
    p.computed.fill(1);
    return;
  }

  const centerEnd = p.startCount + p.centerCount;
  const end = p.startCount + p.centerCount + p.endCount;

  for (let row = 0; row < p.topCount; row++) {
    if (p.computed[row]) continue;

    computeSpans(p, row, p.startCount, p.topCount, 0);
    computeSpans(p, row, centerEnd, p.topCount, p.startCount);
    computeSpans(p, row, end, p.topCount, centerEnd);
  }
  for (let row = Math.max(p.rowStart - p.rowScanDistance, p.topCount); row < p.rowEnd; row++) {
    if (p.computed[row]) continue;

    computeSpans(p, row, p.startCount, centerEnd, 0);
    computeSpans(p, row, centerEnd, p.rowMax - p.botCount, p.startCount);
    computeSpans(p, row, end, p.rowMax + p.botCount, centerEnd);
  }
  const botMax = p.rowMax + p.botCount;
  for (let row = p.rowMax; row < botMax; row++) {
    if (p.computed[row]) continue;

    computeSpans(p, row, p.startCount, botMax, 0);
    computeSpans(p, row, centerEnd, botMax, p.startCount);
    computeSpans(p, row, end, botMax, centerEnd);
  }
}

function computeSpans(
  {
    computed,
    special,
    lookup,
    base: bb,

    computeColSpan,
    computeRowSpan,
    isFullWidth,
    isRowCutoff,
  }: UpdateLayoutArgs,
  row: number,
  maxColBound: number,
  maxRowBound: number,
  start: number,
) {
  computed[row] = 1;

  // handles full width
  if (special[row] === FULL_WIDTH) return;
  if (isFullWidth && isFullWidth(row)) {
    special[row] = FULL_WIDTH;
    return;
  }

  const isCutOff = isRowCutoff(row);

  let base = lookup.get(row);
  for (let col = start; col < maxColBound; col++) {
    const hasDead = special[row] === CONTAINS_DEAD_CELLS;
    const colSIndex = col * 4;

    // The cell is dead. It won't be rendered
    if (hasDead && (base?.[colSIndex] === 0 || base?.[colSIndex] === -1)) continue;

    const colSpan = computeColSpan ? clamp(1, computeColSpan(row, col), maxColBound - col) : 1;
    const rowSpan = computeRowSpan ? clamp(1, computeRowSpan(row, col), maxRowBound - row) : 1;

    if (colSpan <= 1 && rowSpan <= 1) continue;

    if (!base) {
      base = new Int32Array(bb);
      lookup.set(row, base);
    }

    base[colSIndex] = rowSpan;
    base[colSIndex + 1] = colSpan;

    const colSpanBound = Math.min(maxColBound, col + colSpan);
    // We span some columns
    if (colSpan > 1) {
      special[row] = CONTAINS_DEAD_CELLS;
      for (let ci = col + 1; ci < colSpanBound; ci++) {
        const ciOff = ci * 4;
        base[ciOff] = 0;

        base[ciOff + 2] = row;
        base[ciOff + 3] = col;
      }
    }

    if (isCutOff) continue;

    if (rowSpan > 1) {
      const bound = Math.min(maxRowBound, row + rowSpan);

      for (let ri = row + 1; ri < bound; ri++) {
        const isFull = isFullWidth ? isFullWidth(ri) : false;
        if (isFull) {
          special[ri] = FULL_WIDTH;
          break;
        }
        if (isRowCutoff(ri)) break;

        special[ri] = CONTAINS_DEAD_CELLS;

        if (!lookup.has(ri)) lookup.set(ri, new Int32Array(bb));
        const localBase = lookup.get(ri)!;

        localBase[colSIndex] = -1;
        localBase[colSIndex + 2] = row;
        localBase[colSIndex + 3] = col;

        if (colSpan > 1) {
          for (let ci = col + 1; ci < colSpanBound; ci++) {
            const ciOff = ci * 4;
            localBase[ciOff] = -1;

            localBase[ciOff + 2] = row;
            localBase[ciOff + 3] = col;
          }
        }
      }
    }
  }
}
