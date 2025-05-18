import {
  clearCells,
  clipboardCopyCells,
  clipboardPasteCells,
} from "@1771technologies/grid-core-pro";
import type { ApiPro, CellSelectionRectPro } from "@1771technologies/grid-types/pro";

export const clipboard = <D, E>(
  api: ApiPro<D, E>,
): {
  clipboardCopyCells: ApiPro<D, E>["clipboardCopyCells"];
  clipboardCutCells: ApiPro<D, E>["clipboardCutCells"];
  clipboardPasteCells: ApiPro<D, E>["clipboardPasteCells"];
} => {
  function flashCells(rect: CellSelectionRectPro | null | undefined) {
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
    clipboardCopyCells: ApiPro<D, E>["clipboardCopyCells"];
    clipboardCutCells: ApiPro<D, E>["clipboardCutCells"];
    clipboardPasteCells: ApiPro<D, E>["clipboardPasteCells"];
  };
};
