import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import type { ServerData } from "../server-data";
import type { RowSourceServer } from "../use-server-data-source";
import type { DataRequest } from "../types";
import { equal } from "@1771technologies/lytenyte-shared";

export function useOnViewChange<T>(
  source: ServerData,
  requestsForView: DataRequest[],
  setRequestsForView: (v: DataRequest[]) => void,
) {
  const onViewChange: RowSourceServer<T>["onViewChange"] = useEvent((bounds) => {
    // This will result in the server sending the requests for the current view.
    source.rowViewBounds = [bounds.rowCenterStart, bounds.rowCenterEnd];

    const requests = source.requestsForView();
    if (equal(requests, requestsForView)) return;

    setRequestsForView(requests);
  });

  return onViewChange;
}
