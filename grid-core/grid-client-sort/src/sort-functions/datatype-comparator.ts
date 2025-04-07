export function datatypeComparator(
  left: unknown,
  right: unknown,
  datatype: "number" | "string" | "function" | "boolean" | "object",
) {
  if (typeof left === datatype && typeof right !== datatype) {
    return -1;
  }
  if (typeof left !== datatype && typeof right === datatype) {
    return 1;
  }
  return 0;
}
