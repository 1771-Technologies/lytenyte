export function isObject(x: any): boolean {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}
