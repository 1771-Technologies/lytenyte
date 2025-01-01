export function min(data: (number | null | undefined)[]) {
  if (!data.length) return 0;

  let min = data[0];
  for (let i = data.length - 1; i > 0; i--) {
    const d = data[i];
    if (d != null && min == null) min = d;
    else if (d == null) continue;
    else if (d < min!) min = data[i];
  }

  return min ?? 0;
}
