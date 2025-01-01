export function last(d: unknown[]) {
  return d.findLast((c) => c != null);
}
