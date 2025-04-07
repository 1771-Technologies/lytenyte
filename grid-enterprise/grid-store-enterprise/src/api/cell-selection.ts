import {
  deselectRectRange,
  expandCellSelectionDown,
  expandCellSelectionEnd,
  expandCellSelectionStart,
  expandCellSelectionUp,
  isWithinSelectionRect,
} from "@1771technologies/grid-core-enterprise";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const cellSelection = <D, E>(
  api: ApiPro<D, E>,
): {
  cellSelectionIsSelected: ApiPro<D, E>["cellSelectionIsSelected"];
  cellSelectionDeselectRect: ApiPro<D, E>["cellSelectionDeselectRect"];
  cellSelectionExpandDown: ApiPro<D, E>["cellSelectionExpandDown"];
  cellSelectionExpandEnd: ApiPro<D, E>["cellSelectionExpandEnd"];
  cellSelectionExpandStart: ApiPro<D, E>["cellSelectionExpandStart"];
  cellSelectionExpandUp: ApiPro<D, E>["cellSelectionExpandUp"];
  cellSelectionSelectRect: ApiPro<D, E>["cellSelectionSelectRect"];
} => {
  return {
    cellSelectionDeselectRect: (range) => {
      const s = api.getState();
      const selections = s.cellSelections.peek();

      const next = [...selections].flatMap((c) => deselectRectRange(c, range));

      s.cellSelections.set(next);
    },

    cellSelectionIsSelected: (r, c) => {
      const s = api.getState();

      for (const range of s.cellSelections.peek()) {
        if (isWithinSelectionRect(range, r, c)) return true;
      }

      return false;
    },
    cellSelectionSelectRect: (rct, additive = false) => {
      const sel = api.getState().cellSelections;
      const next = additive ? [...sel.peek(), rct] : [rct];

      sel.set(next);
    },
    cellSelectionExpandDown: (p) => expandCellSelectionDown(api, p?.ref, p?.pivot),
    cellSelectionExpandUp: (p) => expandCellSelectionUp(api, p?.ref, p?.pivot),
    cellSelectionExpandStart: (p) => expandCellSelectionStart(api, p?.ref, p?.pivot),
    cellSelectionExpandEnd: (p) => expandCellSelectionEnd(api, p?.ref, p?.pivot),
  } satisfies {
    cellSelectionIsSelected: ApiPro<D, E>["cellSelectionIsSelected"];
    cellSelectionDeselectRect: ApiPro<D, E>["cellSelectionDeselectRect"];
    cellSelectionExpandDown: ApiPro<D, E>["cellSelectionExpandDown"];
    cellSelectionExpandEnd: ApiPro<D, E>["cellSelectionExpandEnd"];
    cellSelectionExpandStart: ApiPro<D, E>["cellSelectionExpandStart"];
    cellSelectionExpandUp: ApiPro<D, E>["cellSelectionExpandUp"];
    cellSelectionSelectRect: ApiPro<D, E>["cellSelectionSelectRect"];
  };
};
