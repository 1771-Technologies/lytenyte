import type { Alignment, OffsetValue, Side } from "./types";
import { getAxis } from "./utils";

export function getOffset(
  side: Side,
  alignment: Alignment | undefined,
  offsetValue: OffsetValue,
  rtl: boolean,
) {
  const isVertical = getAxis(side) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;

  // eslint-disable-next-line prefer-const
  let { mainAxis, crossAxis, alignmentAxis } =
    typeof offsetValue === "number"
      ? { mainAxis: offsetValue, crossAxis: 0, alignmentAxis: null }
      : {
          mainAxis: offsetValue.mainAxis || 0,
          crossAxis: offsetValue.crossAxis || 0,
          alignmentAxis: offsetValue.alignmentAxis,
        };

  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }

  return isVertical
    ? { x: crossAxis * crossAxisMulti, y: mainAxis * mainAxisMulti }
    : { x: mainAxis * mainAxisMulti, y: crossAxis * crossAxisMulti };
}
