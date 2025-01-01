export function max(data: (number | null | undefined)[]) {
  if (!data.length) return 0;

  let max = data[0];
  for (let i = data.length - 1; i > 0; i--) {
    const d = data[i];
    if (d != null && max == null) max = d;
    else if (d == null) continue;
    else if (d > max!) max = data[i];
  }

  return max ?? 0;
}
