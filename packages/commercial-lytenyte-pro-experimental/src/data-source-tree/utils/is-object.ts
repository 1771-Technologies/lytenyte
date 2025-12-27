export function isObject(x: any) {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}
