import type { InternalAtoms } from "../+types";
import type { Grid, GridApi } from "../../+types";

export const makeDialogFrameOpen = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["dialogFrameOpen"] => {
  return (id, context) => {
    grid.internal.dialogFrames.set((prev) => ({ ...prev, [id]: context }));
  };
};

export const makeDialogFrameClose = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["dialogFrameClose"] => {
  return (id) => {
    grid.internal.dialogFrames.set((prev) => {
      if (!id) return {};

      const next = { ...prev };
      delete next[id];
      return next;
    });
  };
};
