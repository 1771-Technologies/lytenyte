import type { Benchmark, BenchmarkResult, BrowserOptions } from "./types.js";
import { wait } from "@1771technologies/lytenyte-shared";
import { applyForceGC } from "./browser/force-gc.js";
import { startBrowser } from "./browser/get-browser.js";
import { readTraceStats } from "./browser/read-trace-stats.js";
import { computeSummaryStats } from "./stats/compute-summary-stats.js";
import { computePerformanceTable } from "./stats/compute-performance-table.js";

export interface RunOptions {
  benchmarks: Benchmark[];
  roundRobin?: boolean;
  iterations?: number;
  browserOptions?: BrowserOptions;
}

export async function run({ benchmarks, roundRobin = true, iterations = 5, browserOptions }: RunOptions) {
  const results: Record<string, BenchmarkResult[]> = {};

  if (roundRobin) {
    for (let j = 0; j < iterations; j++) {
      for (let i = 0; i < benchmarks.length; i++) {
        console.log(`Running: ${benchmarks[i].name} (${j}/${iterations})`);

        const memory = await runMemBenchmark(benchmarks[i], browserOptions);
        const trace = await runCpuBenchmark(benchmarks[i], browserOptions);

        results[benchmarks[i].name] ??= [];
        results[benchmarks[i].name].push({
          name: benchmarks[i].name,
          memory,
          timing: trace,
        });
      }
    }
  } else {
    for (let i = 0; i < benchmarks.length; i++) {
      for (let j = 0; j < iterations; j++) {
        console.log(`Running: ${benchmarks[i].name} (${j}/${iterations})`);

        const memory = await runMemBenchmark(benchmarks[i], browserOptions);
        const trace = await runCpuBenchmark(benchmarks[i], browserOptions);

        results[benchmarks[i].name] ??= [];
        results[benchmarks[i].name].push({
          name: benchmarks[i].name,
          memory,
          timing: trace,
        });
      }
    }
  }

  const resultSummary = Object.entries(results).map(([name, res]) => {
    return computeSummaryStats(res, name);
  });

  const performance = computePerformanceTable(resultSummary);

  return performance;
}

async function runCpuBenchmark(bench: Benchmark, opts?: BrowserOptions) {
  const browser = await startBrowser(opts);

  const context = await browser.newContext({
    viewport: {
      width: opts?.size?.width ?? 1000,
      height: opts?.size?.height ?? 1000,
    },
  });
  const page = await context.newPage();

  const categories = ["blink.user_timing", "devtools.timeline", "disabled-by-default-devtools.timeline"];
  await bench.before?.(page);
  await applyForceGC(page);

  await browser.startTracing(page, {
    path: `traces/${bench.name}.json`,
    screenshots: false,
    categories,
  });

  await page.evaluate(() => {
    performance.mark("bench_start");
  });

  await bench.run(page);

  await page.evaluate(() => {
    performance.mark("bench_end");
  });
  await page.evaluate(() => {
    performance.measure("bench", "bench_start", "bench_end");
  });

  await wait(40);
  await browser.stopTracing();

  const result = readTraceStats(`traces/${bench.name}.json`);

  await bench.after?.(page);
  await browser.close();

  return result;
}

async function runMemBenchmark(bench: Benchmark, opts?: BrowserOptions) {
  const browser = await startBrowser(opts);

  const context = await browser.newContext({
    viewport: {
      width: opts?.size?.width ?? 1000,
      height: opts?.size?.height ?? 1000,
    },
  });
  const page = await context.newPage();

  const client = await page.context().newCDPSession(page);
  await client.send("Performance.enable");

  await bench.before?.(page);
  await applyForceGC(page);

  await bench.run(page);

  await wait(40);

  const result =
    (await client.send("Performance.getMetrics")).metrics.filter((m) => m.name === "JSHeapUsedSize")[0]
      .value /
    1024 /
    1024;

  await bench.after?.(page);
  await browser.close();

  return result;
}
