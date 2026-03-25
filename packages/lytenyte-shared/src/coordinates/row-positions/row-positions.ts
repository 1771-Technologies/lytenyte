import type { RowHeight } from "../../types.js";

/**
 * Calculates vertical (y) coordinates for rows in a virtualized grid view.
 *
 * Each coordinate is computed cumulatively by adding the current row's height
 * to the previous row's position, creating a progressive offset pattern.
 */
export function rowPositions(
  rowCount: number,
  rowHeight: RowHeight,
  autoHeightGuess: number,
  autoHeightCache: Record<number, number>,
  getDetailHeight: (id: string | null) => number,
  containerHeight: number,
  rowIndexToRowId: (i: number) => string | null,
): readonly [Uint32Array, Map<string, number>] {
  const n = Math.max(0, rowCount);

  const makeFixed = (getH: (i: number) => number) => {
    const idToPosition = new Map<string, number>();
    const positions = new Uint32Array(n + 1);
    for (let i = 0; i < n; i++) {
      const id = rowIndexToRowId(i);
      positions[i + 1] = positions[i] + Math.max(getH(i) + getDetailHeight(id), 0);

      if (id) idToPosition.set(id, positions[i]);
    }

    return [positions as Uint32Array, idToPosition] as const;
  };

  if (typeof rowHeight === "number") return makeFixed(() => rowHeight);
  if (rowHeight === "auto") return makeFixed((i) => autoHeightCache[i] ?? autoHeightGuess);
  if (typeof rowHeight === "function") return makeFixed(rowHeight);

  // Handle fill height rows (format: "fill:X")
  // Distributes available space when rows don't fill the container.
  // Falls back to fixed height behavior when rows exceed or exactly fill it.
  const height = Math.round(Number.parseFloat(rowHeight.slice(5)));
  const freeSpace = containerHeight - height * n;

  if (freeSpace <= 0 || n === 0) return makeFixed(() => height);

  const unit = Math.floor(freeSpace / n);
  let remainder = freeSpace - unit * n - 1;

  return makeFixed(() => height + unit + (remainder > 0 ? (remainder--, 1) : 0));
}
