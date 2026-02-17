export function getRequestId(path: (string | null)[], start: number, end: number) {
  if (path.length === 0) return `__ROOT__/${start}-${end}`;

  const key = path.map((s) => (s == null ? `__null__` : s)).join("/") + `${start}-${end}`;

  return key;
}
