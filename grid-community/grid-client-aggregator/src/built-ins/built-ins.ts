import { avg } from "./avg.js";
import { count } from "./count.js";
import { first } from "./first.js";
import { last } from "./last.js";
import { max } from "./max.js";
import { min } from "./min.js";
import { sum } from "./sum.js";

/**
 * Collection of built-in array utility functions for numerical and statistical operations.
 * Each function handles null and undefined values gracefully.
 * @example
 * import { builtIns } from './builtIns';
 *
 * const data = [1, null, 3, 2];
 * builtIns.sum(data);  // Returns 6
 * builtIns.avg(data);  // Returns 2
 */
export const builtIns = {
  /** Calculate sum of non-null numbers in array */
  sum: sum,
  /** Count non-null/undefined elements in array */
  count: count,
  /** Calculate average of non-null numbers in array */
  avg: avg,
  /** Get first non-null/undefined element in array */
  first: first,
  /** Get last non-null/undefined element in array */
  last: last,
  /** Find minimum value among non-null/undefined numbers in array */
  min: min,
  /** Find maximum value among non-null/undefined numbers in array */
  max: max,
};

/**
 * Set containing valid built-in function names.
 * Used for validating function names and checking available operations.
 * @example
 * const isValidFunction = validBuiltIns.has('sum');  // Returns true
 * const isInvalidFunction = validBuiltIns.has('median');  // Returns false
 */
export const validBuiltIns = new Set(Object.keys(builtIns));
