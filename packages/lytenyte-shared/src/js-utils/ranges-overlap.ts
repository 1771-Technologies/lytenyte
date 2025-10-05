export function rangesOverlap(ls: number, le: number, rs: number, re: number) {
  // A range is considered overlapping if there is at least one point shared.
  // So we check if the ranges are NOT disjoint.
  return le > rs && re > ls;
}
