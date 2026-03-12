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
  readonly run: (page: Page) => Promise<void>;
  readonly after?: (page: Page) => Promise<void>;
}

export interface TraceStats {
  jsTime: number;
  layoutTime: number;
  paintTime: number;
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
  readonly memory: StatisticalMetrics;
  readonly jsTime: StatisticalMetrics;
  readonly layoutTime: StatisticalMetrics;
  readonly paintTime: StatisticalMetrics;
}

export interface TableRowMetric {
  readonly value: number;
  readonly relativeDistance: number;
  readonly range: [number, number];
}

export interface PerformanceTableRow {
  readonly name: string;
  readonly memory: TableRowMetric;
  readonly jsTime: TableRowMetric;
  readonly layoutTime: TableRowMetric;
  readonly paintTime: TableRowMetric;
}
