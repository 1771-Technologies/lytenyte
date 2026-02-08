export function arrayShallow(left: any[], right: any[]): boolean {
  if (left.length !== right.length) return false;

  for (let i = 0; i < left.length; i++) {
    if (left[i] !== right[i]) return false;
  }

  return true;
}
