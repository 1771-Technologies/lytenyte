import { useRef } from "react";
import { useEvent } from "@1771technologies/lytenyte-core/internal";
import type { ServerData } from "../server-data";
import type { RowSourceServer } from "../use-server-data-source";
import type { DataRequest } from "../types";
import { equal } from "@1771technologies/js-utils";

export function useOnViewChange<T>(
  source: ServerData,
  requestsForView: DataRequest[],
  setRequestsForView: (v: DataRequest[]) => void,
  debounceDuration: number,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingBoundsRef = useRef<[number, number] | null>(null);

  // Reads latest requestsForView/setRequestsForView at call time (via useEvent), so the
  // timer always flushes against the current state even if renders occurred while pending.
  const flush = useEvent(() => {
    const bounds = pendingBoundsRef.current;
    if (!bounds) return;
    pendingBoundsRef.current = null;

    source.rowViewBounds = bounds;
    const requests = source.requestsForView();
    if (!equal(requests, requestsForView)) setRequestsForView(requests);
  });

  const onViewChange: RowSourceServer<T>["onViewChange"] = useEvent((bounds) => {
    if (debounceDuration <= 0) {
      source.rowViewBounds = [bounds.rowCenterStart, bounds.rowCenterEnd];
      const requests = source.requestsForView();
      if (!equal(requests, requestsForView)) setRequestsForView(requests);
      return;
    }

    // Store the latest bounds so the timer always flushes with the final scroll position, not an intermediate one.
    pendingBoundsRef.current = [bounds.rowCenterStart, bounds.rowCenterEnd];

    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      flush();
    }, debounceDuration);
  });

  return onViewChange;
}
