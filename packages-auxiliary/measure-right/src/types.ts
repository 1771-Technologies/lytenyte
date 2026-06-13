import type { Page } from "playwright";

export interface BrowserOptions {
  size?: {
    width: number;
    height: number;
  };
  headless?: boolean;
  path?: string;
}

export interface Benchmark {
  readonly name: string;
  readonly before?: (page: Page) => Promise<void>;
  readonly warm?: (page: Page) => Promise<void>;
  readonly run: (page: Page) => Promise<void>;
  readonly after?: (page: Page) => Promise<void>;
}

export interface TraceStats {
  duration: number;
  avgFps: number;
  numberCommits: number;
  layouts: number;
  maxDeltaBetweenCommits: number;
  rafLongDelay: number;
}

export interface BenchmarkResult {
  readonly name: string;
  readonly memory: number;
  readonly timing: TraceStats;
}

export interface StatisticalMetrics {
  readonly mean: number;
  readonly mode: number; // A single value for mode
  readonly stdDev: number;
  readonly range: [number, number]; // Range within one std dev
}

export interface BenchmarkStatistics {
  readonly name: string;
  readonly duration: StatisticalMetrics;
  readonly memory: StatisticalMetrics;
  readonly avgFps: StatisticalMetrics;
  readonly numberCommits: StatisticalMetrics;
  readonly layouts: StatisticalMetrics;
  readonly maxDeltaBetweenCommits: StatisticalMetrics;
  readonly rafLongDelay: StatisticalMetrics;
}

export interface TableRowMetric {
  readonly value: number;
  readonly relativeDistance: number;
  readonly range: [number, number];
}

export interface PerformanceTableRow {
  readonly name: string;
  readonly duration: TableRowMetric;
  readonly memory: TableRowMetric;
  readonly avgFps: TableRowMetric;
  readonly numberCommits: TableRowMetric;
  readonly layouts: TableRowMetric;
  readonly maxDeltaBetweenCommits: TableRowMetric;
  readonly rafLongDelay: TableRowMetric;
}
