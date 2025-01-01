import {
  clearCells,
  clipboardCopyCells,
  clipboardPasteCells,
} from "@1771technologies/grid-core-enterprise";
import type { ApiEnterprise } from "@1771technologies/grid-types";
import type { CellSelectionRect } from "@1771technologies/grid-types/enterprise";

export const clipboard = <D, E>(api: ApiEnterprise<D, E>) => {
  function flashCells(rect: CellSelectionRect | null | undefined) {
    if (!rect) {
      const sx = api.getState();
      sx.internal.cellSelectionFlashOn.set(true);

      setTimeout(() => {
        sx.internal.cellSelectionFlashOn.set(false);
      }, 600);
    }
  }

  return {
    clipboardCopyCells: async (rect, opts = {}) => {
      await clipboardCopyCells(api, rect, opts);

      flashCells(rect);
    },
    clipboardCutCells: async (rect, opts = {}) => {
      await clipboardCopyCells(api, rect, opts);
      clearCells(api, rect);

      flashCells(rect);
    },
    clipboardPasteCells: async (rect) => {
      await clipboardPasteCells(api, rect);

      flashCells(rect);
    },
  } satisfies {
    clipboardCopyCells: ApiEnterprise<D, E>["clipboardCopyCells"];
    clipboardCutCells: ApiEnterprise<D, E>["clipboardCutCells"];
    clipboardPasteCells: ApiEnterprise<D, E>["clipboardPasteCells"];
  };
};
