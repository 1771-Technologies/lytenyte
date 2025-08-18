import type { InternalAtoms } from "../+types.js";
import type { Grid, GridApi } from "../../+types.js";

export const makePopoverFrameOpen = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["popoverFrameOpen"] => {
  return (id, target, context) => {
    grid.internal.popoverFrames.set((prev) => ({ ...prev, [id]: { target, context } }));
  };
};

export const makePopoverFrameClose = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["popoverFrameClose"] => {
  return (id) => {
    grid.internal.popoverFrames.set((prev) => {
      if (!id) return {};

      const next = { ...prev };
      delete next[id];
      return next;
    });
  };
};
