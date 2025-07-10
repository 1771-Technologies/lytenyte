export function partitionColumnsByPinState<T extends { pin?: "start" | "end" | null }>(
  columns: T[],
) {
  const start: T[] = [];
  const center: T[] = [];
  const end: T[] = [];

  for (let i = 0; i < columns.length; i++) {
    const c = columns[i];
    if (c.pin === "start") start.push(c);
    else if (c.pin === "end") end.push(c);
    else center.push(c);
  }

  return { start, center, end };
}
