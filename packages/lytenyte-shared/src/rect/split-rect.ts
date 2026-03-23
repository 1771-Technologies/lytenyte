import type { DataRect, Section, SectionedRect } from "./types.js";

/**
 * Splits a rect into up to nine non-overlapping sub-rects based on the pin
 * section cutoff boundaries. Each sub-rect is labelled with its grid section
 * (e.g. `"top-start"`, `"center-center"`, `"bottom-end"`). Sub-rects with
 * zero area are omitted from the result.
 */
export function splitRect(
  rect: DataRect,
  startCutoff: number,
  endCutoff: number,
  topCutoff: number,
  bottomCutoff: number,
): SectionedRect[] {
  const { columnStart, columnEnd, rowStart, rowEnd } = rect;

  const clampedStart = Math.max(columnStart, Math.min(startCutoff, columnEnd));
  const clampedEnd = Math.max(columnStart, Math.min(endCutoff, columnEnd));
  const clampedTop = Math.max(rowStart, Math.min(topCutoff, rowEnd));
  const clampedBottom = Math.max(rowStart, Math.min(bottomCutoff, rowEnd));

  const colRanges: [number, number, "start" | "center" | "end"][] = [
    [columnStart, clampedStart, "start"],
    [clampedStart, clampedEnd, "center"],
    [clampedEnd, columnEnd, "end"],
  ];

  const rowRanges: [number, number, "top" | "center" | "bottom"][] = [
    [rowStart, clampedTop, "top"],
    [clampedTop, clampedBottom, "center"],
    [clampedBottom, rowEnd, "bottom"],
  ];

  const result: SectionedRect[] = [];

  for (const [rs, re, rowLabel] of rowRanges) {
    for (const [cs, ce, colLabel] of colRanges) {
      if (cs >= ce || rs >= re) continue;

      result.push({
        columnStart: cs,
        columnEnd: ce,
        rowStart: rs,
        rowEnd: re,
        section: `${rowLabel}-${colLabel}` as Section,
      });
    }
  }

  return result;
}
