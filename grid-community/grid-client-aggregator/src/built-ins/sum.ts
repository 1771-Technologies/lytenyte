export function sum(data: (number | null)[]) {
  if (!data.length) return 0;

  let total = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    const d = data[i];
    if (d == null) continue;
    total += d;
  }

  return total;
}
