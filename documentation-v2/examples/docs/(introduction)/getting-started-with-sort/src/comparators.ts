import type { GridSpec } from "./demo.js";
import type { RequestData } from "./data.js";
import { compareAsc } from "date-fns";
import type { Grid } from "@1771technologies/lytenyte-pro";

export const sortComparators: Record<string, Grid.T.SortFn<GridSpec["data"]>> = {
  region: (left, right) => {
    if (left.kind !== "leaf" && right.kind !== "leaf") return 0;
    if (left.kind === "leaf" && right.kind !== "leaf") return -1;
    if (left.kind !== "leaf" && right.kind === "leaf") return 1;

    const leftData = left.data as RequestData;
    const rightData = right.data as RequestData;

    return leftData["region.fullname"].localeCompare(rightData["region.fullname"]);
  },
  "timing-phase": (left, right) => {
    if (left.kind !== "leaf" && right.kind !== "leaf") return 0;
    if (left.kind === "leaf" && right.kind !== "leaf") return -1;
    if (left.kind !== "leaf" && right.kind === "leaf") return 1;

    const leftData = left.data as RequestData;
    const rightData = right.data as RequestData;

    return leftData.Latency - rightData.Latency;
  },
  Date: (left, right) => {
    if (left.kind !== "leaf" && right.kind !== "leaf") return 0;
    if (left.kind === "leaf" && right.kind !== "leaf") return -1;
    if (left.kind !== "leaf" && right.kind === "leaf") return 1;

    const leftData = left.data as RequestData;
    const rightData = right.data as RequestData;

    return compareAsc(leftData.Date, rightData.Date);
  },
};
