export function arrayOverlap<T, K = T>(left: T[], right: K[]) {
  return left.some((l) => right.includes(l as unknown as K));
}
