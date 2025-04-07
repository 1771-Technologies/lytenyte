import {
  columnScrollIntoViewValue,
  getBottom,
  getDown,
  getEnd,
  getNext,
  getPageDown,
  getPageUp,
  getPrev,
  getStart,
  getTop,
  getUp,
  rowScrollIntoViewValue,
} from "@1771technologies/grid-core";
import type { ApiCore, PositionCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";
import { equal } from "@1771technologies/js-utils";

export const navigate = <D, E, T extends ApiCore<D, E> | ApiPro<D, E>>(
  a: T,
): {
  navigateNext: () => void;
  navigatePrev: () => void;
  navigateDown: () => void;
  navigateUp: () => void;
  navigatePageDown: () => void;
  navigatePageUp: () => void;
  navigateToBottom: () => void;
  navigateToTop: () => void;
  navigateToEnd: () => void;
  navigateToStart: () => void;
  navigateScrollIntoView: (r: number | null | undefined, c: number | null | undefined) => void;
  navigateGetNext: () => PositionCore | null;
  navigateGetPrev: () => PositionCore | null;
  navigateGetUp: () => PositionCore | null;
  navigateGetDown: () => PositionCore | null;
  navigateGetBottom: () => PositionCore | null;
  navigateGetTop: () => PositionCore | null;
  navigateGetPageDown: () => PositionCore | null;
  navigateGetPageUp: () => PositionCore | null;
  navigateGetStart: () => PositionCore | null;
  navigateGetEnd: () => PositionCore | null;
  navigateSetPosition: (p: PositionCore | null) => void;
  navigateGetPosition: () => PositionCore | null;
} => {
  const get = () => api.getState().internal.navigatePosition.peek();

  const api = a as ApiCore<D, E>;

  return {
    navigateNext: () => {
      const p = api.navigateGetNext();
      if (equal(p, get())) return;

      api.eventFire("onNavigateNext", api);
      api.navigateSetPosition(p);
    },
    navigatePrev: () => {
      const p = api.navigateGetPrev();
      if (equal(p, get())) return;

      api.eventFire("onNavigatePrev", api);
      api.navigateSetPosition(p);
    },
    navigateDown: () => {
      const p = api.navigateGetDown();
      if (equal(p, get())) return;

      api.eventFire("onNavigateDown", api);
      api.navigateSetPosition(p);
    },
    navigateUp: () => {
      const p = api.navigateGetUp();
      if (equal(p, get())) return;

      api.eventFire("onNavigateUp", api);
      api.navigateSetPosition(p);
    },
    navigatePageDown: () => {
      const p = api.navigateGetPageDown();
      if (equal(p, get())) return;

      api.eventFire("onNavigatePageDown", api);
      api.navigateSetPosition(p);
    },
    navigatePageUp: () => {
      const p = api.navigateGetPageUp();
      if (equal(p, get())) return;

      api.eventFire("onNavigatePageUp", api);
      api.navigateSetPosition(p);
    },
    navigateToBottom: () => {
      const p = api.navigateGetBottom();
      if (equal(p, get())) return;

      api.eventFire("onNavigateToBottom", api);
      api.navigateSetPosition(p);
    },
    navigateToTop: () => {
      const p = api.navigateGetTop();
      if (equal(p, get())) return;

      api.eventFire("onNavigateToTop", api);
      api.navigateSetPosition(p);
    },
    navigateToEnd: () => {
      const p = api.navigateGetEnd();
      if (equal(p, get())) return;

      api.eventFire("onNavigateToEnd", api);
      api.navigateSetPosition(p);
    },
    navigateToStart: () => {
      const p = api.navigateGetStart();
      if (equal(p, get())) return;

      api.eventFire("onNavigateToStart", api);
      api.navigateSetPosition(p);
    },

    navigateScrollIntoView: (r, c) => {
      const s = api.getState();
      const viewport = s.internal.viewport.peek();
      if (!viewport) return;

      const rtlModifier = s.rtl.peek() ? -1 : 1;

      const vr = r != null ? rowScrollIntoViewValue(api, r) : undefined;
      const vc = c != null ? columnScrollIntoViewValue(api, c) : undefined;

      viewport.scrollTo({ top: vr, left: vc != null ? rtlModifier * vc : vc });
    },

    navigateGetNext: () => {
      return getNext(api);
    },
    navigateGetPrev: () => {
      return getPrev(api);
    },
    navigateGetUp: () => {
      return getUp(api);
    },
    navigateGetDown: () => {
      return getDown(api);
    },
    navigateGetBottom: () => {
      return getBottom(api);
    },
    navigateGetTop: () => {
      return getTop(api);
    },
    navigateGetPageDown: () => {
      return getPageDown(api);
    },
    navigateGetPageUp: () => {
      return getPageUp(api);
    },
    navigateGetStart: () => {
      return getStart(api);
    },
    navigateGetEnd: () => {
      return getEnd(api);
    },

    navigateSetPosition: (p) => {
      if (p === get()) return;

      api.getState().internal.navigatePosition.set(p);
      api.eventFire("onNavigateChange", api);
    },
    navigateGetPosition: () => get(),
  } satisfies {
    navigateDown: T["navigateDown"];
    navigateGetBottom: T["navigateGetBottom"];
    navigateGetDown: T["navigateGetDown"];
    navigateGetEnd: T["navigateGetEnd"];
    navigateGetNext: T["navigateGetNext"];
    navigateGetPageDown: T["navigateGetPageDown"];
    navigateGetPageUp: T["navigateGetPageUp"];
    navigateGetPosition: T["navigateGetPosition"];
    navigateGetPrev: T["navigateGetPrev"];
    navigateGetStart: T["navigateGetStart"];
    navigateGetTop: T["navigateGetTop"];
    navigateGetUp: T["navigateGetUp"];
    navigateNext: T["navigateNext"];
    navigatePageDown: T["navigatePageDown"];
    navigatePageUp: T["navigatePageUp"];
    navigatePrev: T["navigatePrev"];
    navigateScrollIntoView: T["navigateScrollIntoView"];
    navigateSetPosition: T["navigateSetPosition"];
    navigateToBottom: T["navigateToBottom"];
    navigateToEnd: T["navigateToEnd"];
    navigateToStart: T["navigateToStart"];
    navigateToTop: T["navigateToTop"];
    navigateUp: T["navigateUp"];
  };
};
