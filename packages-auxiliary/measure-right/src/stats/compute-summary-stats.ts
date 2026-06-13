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
  return {
    name,
    duration: calculateStatistics(results.map((r) => r.timing.duration)),
    memory: calculateStatistics(results.map((r) => r.memory)),
    avgFps: calculateStatistics(results.map((r) => r.timing.avgFps)),
    numberCommits: calculateStatistics(results.map((r) => r.timing.numberCommits)),
    layouts: calculateStatistics(results.map((r) => r.timing.layouts)),
    maxDeltaBetweenCommits: calculateStatistics(results.map((r) => r.timing.maxDeltaBetweenCommits)),
    rafLongDelay: calculateStatistics(results.map((r) => r.timing.rafLongDelay)),
  };
}
