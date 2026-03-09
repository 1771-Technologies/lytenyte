import type { BenchmarkResult, BenchmarkStatistics, StatisticalMetrics } from "../types.js";
import { calculateMean } from "./calculate-mean.js";
import { calculateMode } from "./calculate-mode.js";
import { calculateStdDev } from "./calculate-std-dev.js";

function calculateStatistics(values: number[]): StatisticalMetrics {
  const mean = calculateMean(values);
  const mode = calculateMode(values);
  const stdDev = calculateStdDev(values, mean);
  const range: [number, number] = [mean - stdDev, mean + stdDev];
  return { mean, mode, stdDev, range };
}

export function computeSummaryStats(results: BenchmarkResult[], name: string): BenchmarkStatistics {
  const memoryValues = results.map((result) => result.memory);
  const jsTimeValues = results.map((result) => result.timing.jsTime);
  const layoutTimeValues = results.map((result) => result.timing.layoutTime);
  const paintTimeValues = results.map((result) => result.timing.paintTime);

  return {
    name,
    memory: calculateStatistics(memoryValues),
    jsTime: calculateStatistics(jsTimeValues),
    layoutTime: calculateStatistics(layoutTimeValues),
    paintTime: calculateStatistics(paintTimeValues),
  };
}
