import type { RowLayout } from "./create-row-layout";

const FALLBACK_BUDGET_MS = 5;

export function warmup(layout: RowLayout, start: number, end: number): () => void {
  let current = start;
  let callbackId: number | null = null;
  const hasIdleCallback = typeof requestIdleCallback === "function";

  function processIdle(deadline: IdleDeadline): void {
    while (current < end && deadline.timeRemaining() > 0) {
      layout.layoutByIndex(current);
      current++;
    }

    if (current < end) {
      callbackId = requestIdleCallback(processIdle);
    } else {
      callbackId = null;
    }
  }

  function processFallback(): void {
    const startTime = Date.now();

    while (current < end && Date.now() - startTime < FALLBACK_BUDGET_MS) {
      layout.layoutByIndex(current);
      current++;
    }

    if (current < end) {
      callbackId = setTimeout(processFallback, 0) as unknown as number;
    } else {
      callbackId = null;
    }
  }

  if (hasIdleCallback) {
    callbackId = requestIdleCallback(processIdle);
  } else {
    callbackId = setTimeout(processFallback, 0) as unknown as number;
  }

  return () => {
    if (callbackId !== null) {
      if (hasIdleCallback) cancelIdleCallback(callbackId);
      else clearTimeout(callbackId);

      callbackId = null;
    }
  };
}
