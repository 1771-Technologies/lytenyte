import { useEvent, useRoot } from "@1771technologies/lytenyte-core-experimental/internal";
import type { API, DataRect } from "../../types";
import { type Writable } from "@1771technologies/lytenyte-shared";

export function useProAPI(cellSelections: DataRect[]) {
  const { api: coreApi } = useRoot();

  const api = coreApi as Writable<API>;

  api.cellSelections = useEvent(() => cellSelections);

  return api as API;
}
