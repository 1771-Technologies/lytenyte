import type { DataRect } from "../types.js";

interface Cutoffs {
  readonly startCutoff: number;
  readonly endCutoff: number;
  readonly topCutoff: number;
  readonly bottomCutoff: number;
}

interface AccessFlags {
  readonly startAccessible: boolean;
  readonly endAccessible: boolean;
  readonly topAccessible: boolean;
  readonly bottomAccessible: boolean;
}

/**
 * Clamps a rect to the accessible pin regions of the viewport. Each inaccessible
 * edge is clamped to its pin cutoff boundary. Returns null if the clamped rect
 * has zero area.
 */
export function clampRectToAccessible(
  rect: DataRect,
  cutoffs: Cutoffs,
  access: AccessFlags,
): DataRect | null {
  let { columnStart, columnEnd, rowStart, rowEnd } = rect;

  if (!access.startAccessible) columnStart = Math.max(columnStart, cutoffs.startCutoff);
  if (!access.endAccessible) columnEnd = Math.min(columnEnd, cutoffs.endCutoff);
  if (!access.topAccessible) rowStart = Math.max(rowStart, cutoffs.topCutoff);
  if (!access.bottomAccessible) rowEnd = Math.min(rowEnd, cutoffs.bottomCutoff);

  if (columnStart >= columnEnd || rowStart >= rowEnd) return null;

  return { columnStart, columnEnd, rowStart, rowEnd };
}
