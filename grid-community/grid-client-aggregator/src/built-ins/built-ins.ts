import { avg } from "./avg.js";
import { count } from "./count.js";
import { first } from "./first.js";
import { last } from "./last.js";
import { max } from "./max.js";
import { min } from "./min.js";
import { sum } from "./sum.js";

export const builtIns = {
  sum: sum,
  count: count,
  avg: avg,
  first: first,
  last: last,
  min: min,
  max: max,
};
export const validBuiltIns = new Set(Object.keys(builtIns));
