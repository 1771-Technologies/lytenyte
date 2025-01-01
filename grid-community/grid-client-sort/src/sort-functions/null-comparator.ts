export function nullComparator(left: unknown, right: unknown, nullsAppearFirst: boolean) {
  if (left != null && right == null) {
    return nullsAppearFirst ? 1 : -1;
  }
  if (left == null && right != null) {
    return nullsAppearFirst ? -1 : 1;
  }
  return 0;
}
