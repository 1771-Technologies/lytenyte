import { readFileSync } from "fs";
import type { TraceStats } from "../types";

interface ChromeTraceEvent {
  cat: string;
  name: string;
  ts: number; // microseconds
  dur?: number; // microseconds
  ph?: string;
  pid?: number;
  args?: any;
}

export function readTraceStats(traceFile: string): TraceStats {
  const traceData = JSON.parse(readFileSync(traceFile, "utf-8"));
  const events: ChromeTraceEvent[] = traceData.traceEvents || [];

  // --- Find benchmark window using user timing marks/measures ---
  // Recommended to emit these in your benchmark:
  //   performance.mark("bench_start");
  //   performance.mark("bench_end");
  //   performance.measure("bench", "bench_start", "bench_end");
  //
  // If "bench" measure exists (has dur), we use that.
  // Else if start/end marks exist, we use those.
  // Else we fall back to including the whole trace (original behavior).
  const userTimingEvents = events.filter((e) => e.cat?.includes("blink.user_timing"));

  const benchMeasure = userTimingEvents.find(
    (e) => e.name === "bench" && typeof e.ts === "number" && typeof e.dur === "number",
  );

  let startUs: number | undefined;
  let endUs: number | undefined;

  if (benchMeasure) {
    startUs = benchMeasure.ts;
    endUs = benchMeasure.ts + (benchMeasure.dur as number);
  } else {
    const startMark = userTimingEvents.find((e) => e.name === "bench_start" && typeof e.ts === "number");
    const endMark = userTimingEvents.find((e) => e.name === "bench_end" && typeof e.ts === "number");

    if (startMark && endMark && endMark.ts > startMark.ts) {
      startUs = startMark.ts;
      endUs = endMark.ts;
    }
  }

  const inWindow = (ts: number, dur?: number) => {
    if (startUs === undefined || endUs === undefined) return true;
    const evEnd = ts + (dur ?? 0);
    return evEnd > startUs && ts < endUs;
  };

  const commitEvents: ChromeTraceEvent[] = [];
  const layoutEvents: ChromeTraceEvent[] = [];

  events.forEach((event) => {
    const { name, ts, dur, ph } = event;
    if (ph !== "X" || !name || !dur || ts === undefined || !inWindow(ts, dur)) return;
    if (name === "Commit") commitEvents.push(event);
    if (name === "Layout") layoutEvents.push(event);
  });

  const sortedCommits = commitEvents.sort((a, b) => a.ts - b.ts);
  const lastCommit = sortedCommits.at(-1);
  const windowEndUs = endUs ?? startUs ?? 0;
  const windowStartUs = startUs ?? 0;

  // maxDeltaBetweenCommits: spread between the first and last Commit timestamps (ms).
  // A large value means rendering happened in multiple passes over a long period,
  // indicating inefficient batching.
  const maxDeltaBetweenCommits =
    sortedCommits.length >= 2 ? (sortedCommits.at(-1)!.ts - sortedCommits[0].ts) / 1000 : 0;

  // avgFps: frames per second estimated from AnimationFrame async-start events (ph=s).
  // Computed as (frameCount - 1) / elapsedSeconds.
  const animationFrames = events
    .filter((e) => e.name === "AnimationFrame" && e.ph === "s" && e.ts !== undefined && inWindow(e.ts))
    .sort((a, b) => a.ts - b.ts);
  const avgFps =
    animationFrames.length >= 2
      ? (animationFrames.length - 1) / ((animationFrames.at(-1)!.ts - animationFrames[0].ts) / 1_000_000)
      : 0;

  // rafLongDelay: excess vsync wait time (ms) beyond the expected 16ms frame budget.
  // When exactly one AnimationFrame fires after bench_end with a gap > 16ms and no
  // Commit has occurred before it, the browser was idle waiting for vsync. The excess
  // beyond 16ms is subtracted from duration so idle vsync wait does not inflate results.
  let rafLongDelay = 0;
  const framesAfterBenchEnd = animationFrames.filter((e) => e.ts > windowEndUs);
  if (framesAfterBenchEnd.length === 1) {
    const waitDelay = (framesAfterBenchEnd[0].ts - windowEndUs) / 1000;
    const hasCommitBeforeFrame = sortedCommits.some((c) => c.ts < framesAfterBenchEnd[0].ts);
    if (waitDelay > 16 && !hasCommitBeforeFrame) {
      rafLongDelay = waitDelay - 16;
    }
  }

  // duration: wall-clock time from bench_start to the end of the last Commit (ms),
  // corrected by subtracting rafLongDelay to remove idle vsync wait inflation.
  // Falls back to the bench window length if no Commit events are present.
  const durationUs = lastCommit
    ? lastCommit.ts + lastCommit.dur! - windowStartUs
    : windowEndUs - windowStartUs;
  const duration = durationUs / 1000 - rafLongDelay;

  return {
    // Wall-clock time from bench_start to end of last Commit, minus any rafLongDelay correction (ms).
    duration,
    // Frames per second estimated from AnimationFrame async-start cadence.
    avgFps,
    // Number of Commit events on the main thread — more than 1 means multiple render passes.
    numberCommits: commitEvents.length,
    // Number of Layout events — unexpected layouts indicate unnecessary reflow work.
    layouts: layoutEvents.length,
    // Spread between first and last Commit timestamps (ms) — large values indicate multi-pass rendering.
    maxDeltaBetweenCommits,
    // Excess vsync wait beyond 16ms subtracted from duration (ms) — non-zero means a vsync correction was applied.
    rafLongDelay,
  };
}
