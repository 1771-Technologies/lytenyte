export function count(d: unknown[]) {
  let c = 0;
  for (let i = d.length - 1; i >= 0; i--) if (d[i] != null) c++;

  return c;
}
