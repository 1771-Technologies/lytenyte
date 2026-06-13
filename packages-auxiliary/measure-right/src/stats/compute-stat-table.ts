import type { BenchmarkResult } from "../types";

export function computeStatTable(results: Record<string, BenchmarkResult[]>): (string | number)[][] {
  const metricNames = [
    "name",
    "duration",
    "avgFps",
    "memory",
    "numberCommits",
    "layouts",
    "maxDeltaBetweenCommits",
    "rafLongDelay",
  ];

  const tables = Object.values(results).flatMap((value) => {
    return value.map((row) => {
      return [
        row.name,
        row.timing.duration,
        row.timing.avgFps,
        row.memory,
        row.timing.numberCommits,
        row.timing.layouts,
        row.timing.maxDeltaBetweenCommits,
        row.timing.rafLongDelay,
      ];
    });
  });

  return [metricNames, ...tables];
}
