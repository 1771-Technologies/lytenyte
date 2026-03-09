import { readFileSync } from "fs";
import type { TraceStats } from "../types";

interface ChromeTraceEvent {
  cat: string;
  name: string;
  ts: number; // microseconds
  dur?: number; // microseconds
  ph?: string;

  args?: any;
}

export function readTraceStats(traceFile: string): TraceStats {
  // Read and parse the JSON file
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

  // Helper: only include events within the benchmark window (if present)
  const inWindow = (ts: number, dur?: number) => {
    if (startUs === undefined || endUs === undefined) return true; // fallback: whole trace
    const evStart = ts;
    const evEnd = ts + (dur ?? 0);
    return evEnd > startUs && evStart < endUs; // overlap check
  };

  const jsEvents: number[] = [];
  const layoutEvents: number[] = [];
  const paintEvents: number[] = [];

  events.forEach((event) => {
    const { cat, name, ts, dur } = event;

    if (cat && name && dur && ts !== undefined && inWindow(ts, dur)) {
      const durationMs = dur / 1000; // Convert from microseconds to milliseconds

      // Categorize events (original logic preserved)
      if (name.includes("FunctionCall") || cat.includes("EvaluateScript")) {
        jsEvents.push(durationMs);
      }
      if (name.includes("Layout") || name.includes("ParseHTML")) {
        layoutEvents.push(durationMs);
      }
      if (name.includes("Paint")) {
        paintEvents.push(durationMs);
      }
    }
  });

  // Calculate total times for each category
  const totalJsTime = jsEvents.reduce((sum, time) => sum + time, 0);
  const totalLayoutTime = layoutEvents.reduce((sum, time) => sum + time, 0);
  const totalPaintTime = paintEvents.reduce((sum, time) => sum + time, 0);

  return {
    jsTime: totalJsTime,
    layoutTime: totalLayoutTime,
    paintTime: totalPaintTime,
  };
}
