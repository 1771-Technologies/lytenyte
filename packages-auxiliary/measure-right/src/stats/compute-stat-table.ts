import type { BenchmarkResult } from "../types";

export function computeStatTable(results: Record<string, BenchmarkResult[]>): (string | number)[][] {
  const metricNames = ["name", "jsTime", "layoutTime", "paintTime", "total", "memory"];

  const tables = Object.values(results).flatMap((value) => {
    return value.map((row) => {
      return [
        row.name,
        row.timing.jsTime,
        row.timing.layoutTime,
        row.timing.paintTime,
        row.timing.jsTime + row.timing.layoutTime + row.timing.paintTime,
        row.memory,
      ];
    });
  });

  return [metricNames, ...tables];
}
