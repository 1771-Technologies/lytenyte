import type { BenchmarkStatistics, PerformanceTableRow } from "../types";

function findBestMetricValue(
  statsList: BenchmarkStatistics[],
  metric: keyof Omit<BenchmarkStatistics, "name">,
): number {
  // Find the minimum value for a given metric across all stats
  return Math.min(...statsList.map((stats) => stats[metric].mean));
}

function calculateRelativeDistance(value: number, bestValue: number): number {
  // Calculate the relative distance percentage from the best value
  return ((value - bestValue) / bestValue) * 100;
}

export function computePerformanceTable(statsList: BenchmarkStatistics[]): PerformanceTableRow[] {
  // Step 1: Calculate "best values" for each metric
  const bestValues: { [metric: string]: number } = {
    memory: findBestMetricValue(statsList, "memory"), // Lowest mean for "memory"
    jsTime: findBestMetricValue(statsList, "jsTime"),
    layoutTime: findBestMetricValue(statsList, "layoutTime"),
    paintTime: findBestMetricValue(statsList, "paintTime"),
  };

  // Step 2: Construct each row object
  const rows = statsList.map((stats) => {
    return {
      name: stats.name,
      memory: {
        value: stats.memory.mean,
        relativeDistance: calculateRelativeDistance(stats.memory.mean, bestValues.memory),
        range: stats.memory.range,
      },
      jsTime: {
        value: stats.jsTime.mean,
        relativeDistance: calculateRelativeDistance(stats.jsTime.mean, bestValues.jsTime),
        range: stats.jsTime.range,
      },
      layoutTime: {
        value: stats.layoutTime.mean,
        relativeDistance: calculateRelativeDistance(stats.layoutTime.mean, bestValues.layoutTime),
        range: stats.layoutTime.range,
      },
      paintTime: {
        value: stats.paintTime.mean,
        relativeDistance: calculateRelativeDistance(stats.paintTime.mean, bestValues.paintTime),
        range: stats.paintTime.range,
      },
    };
  });

  return rows;
}
