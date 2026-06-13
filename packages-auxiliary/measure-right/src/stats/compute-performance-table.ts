import type { BenchmarkStatistics, PerformanceTableRow, TableRowMetric } from "../types";

function bestMin(statsList: BenchmarkStatistics[], metric: keyof Omit<BenchmarkStatistics, "name">): number {
  return Math.min(...statsList.map((s) => s[metric].mean));
}

function bestMax(statsList: BenchmarkStatistics[], metric: keyof Omit<BenchmarkStatistics, "name">): number {
  return Math.max(...statsList.map((s) => s[metric].mean));
}

function makeMetric(
  stats: BenchmarkStatistics,
  key: keyof Omit<BenchmarkStatistics, "name">,
  best: number,
  higherIsBetter = false,
): TableRowMetric {
  const value = stats[key].mean;
  const relativeDistance = higherIsBetter ? ((best - value) / best) * 100 : ((value - best) / best) * 100;
  return { value, relativeDistance, range: stats[key].range };
}

export function computePerformanceTable(statsList: BenchmarkStatistics[]): PerformanceTableRow[] {
  return statsList.map((stats) => ({
    name: stats.name,
    duration: makeMetric(stats, "duration", bestMin(statsList, "duration")),
    memory: makeMetric(stats, "memory", bestMin(statsList, "memory")),
    avgFps: makeMetric(stats, "avgFps", bestMax(statsList, "avgFps"), true),
    numberCommits: makeMetric(stats, "numberCommits", bestMin(statsList, "numberCommits")),
    layouts: makeMetric(stats, "layouts", bestMin(statsList, "layouts")),
    maxDeltaBetweenCommits: makeMetric(
      stats,
      "maxDeltaBetweenCommits",
      bestMin(statsList, "maxDeltaBetweenCommits"),
    ),
    rafLongDelay: makeMetric(stats, "rafLongDelay", bestMin(statsList, "rafLongDelay")),
  }));
}
