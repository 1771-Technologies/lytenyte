import { sum } from "./sum.js";

export function avg(data: (number | null)[]) {
  if (!data.length) return 0;

  const total = sum(data);

  return total / data.length;
}
