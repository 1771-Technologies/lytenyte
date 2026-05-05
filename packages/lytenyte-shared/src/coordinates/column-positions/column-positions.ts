import { makePositionArray } from "@1771technologies/js-utils";
import type { ColumnAbstract } from "../../types.js";
import { columnWidthMeta } from "../column-width-meta/column-width-meta.js";

/**
 * Computes the x coordinate positions for columns given a set of width items.
 * This is done by cumulatively adding successive width amounts. Handles size
 * to fit calculations and free flex width adjustments.
 */
export function columnPositions(
  columns: ColumnAbstract[],
  base: Omit<ColumnAbstract, "id">,
  containerWidth: number,
  sizeToFit: boolean,
): Uint32Array<ArrayBuffer> {
  const { widths, totalWidth, flexTotal } = columnWidthMeta(columns, base);
  const n = columns.length;

  if (flexTotal && totalWidth < containerWidth) {
    const freeSpace = containerWidth - totalWidth;
    const unit = Math.floor(freeSpace / flexTotal);
    let remainder = freeSpace - unit * flexTotal - 1;

    for (let i = n - 1; i >= 0; i--) {
      const flex = columns[i].widthFlex ?? base.widthFlex;
      if (!flex) continue;
      widths[i] += flex * unit + (remainder > 0 ? (remainder--, 1) : 0);
    }
  } else if (sizeToFit) {
    const shrinking = totalWidth > containerWidth;
    const expanding = flexTotal === 0 && totalWidth < containerWidth;

    if (shrinking || expanding) {
      const target = containerWidth - 1;
      const available = Math.abs(totalWidth - target);
      const sign = shrinking ? -1 : 1;
      let remainder = available;

      for (let i = n - 1; i >= 0; i--) {
        const adjust = Math.floor((widths[i] / totalWidth) * available);
        remainder -= adjust;
        widths[i] += sign * adjust;
      }

      for (let i = 0; remainder > 0; i = (i + 1) % n, remainder--) {
        widths[i] += sign;
      }
    }
  }

  return makePositionArray((i) => widths[i]!, n);
}
