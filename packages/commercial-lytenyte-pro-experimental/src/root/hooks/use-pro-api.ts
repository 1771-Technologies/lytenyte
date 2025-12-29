import { useEvent, useRoot } from "@1771technologies/lytenyte-core-experimental/internal";
import type { API } from "../../types";
import type { Writable } from "@1771technologies/lytenyte-shared";
import type { ProContext } from "../context";

export function useProAPI(
  setDialogFrames: ProContext["setDialogFrames"],
  setPopoverFrames: ProContext["setPopoverFrames"],
) {
  const { api: coreApi } = useRoot();

  const api = coreApi as Writable<API>;

  api.dialogFrameOpen = useEvent((id, context) => {
    setDialogFrames((prev) => ({ ...prev, [id]: context }));
  });
  api.dialogFrameClose = useEvent((id) => {
    setDialogFrames((prev) => {
      if (!id) return {};

      const next = { ...prev };
      delete next[id];
      return next;
    });
  });
  api.popoverFrameOpen = useEvent((id, target, context) => {
    setPopoverFrames((prev) => ({ ...prev, [id]: { target, context } }));
  });
  api.popoverFrameClose = useEvent((id) => {
    setPopoverFrames((prev) => {
      if (!id) return {};

      const next = { ...prev };
      delete next[id];
      return next;
    });
  });

  return api as API;
}
