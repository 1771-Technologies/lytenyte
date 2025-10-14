import { getActiveElement } from "../dom-utils/index.js";
import { queryFirstFocusable, queryHeader } from "./query.js";
import type { ScrollIntoViewFn } from "../+types.non-gen.js";
import { runWithBackoff } from "../js-utils/run-with-backoff.js";
import type { PositionUnion } from "../+types.js";

export interface NavigatorParams {
  readonly element: HTMLElement;
  readonly gridId: string;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly position: { get: () => PositionUnion | null; set: (p: PositionUnion | null) => void };

  readonly nextKey: string;
  readonly prevKey: string;
  readonly upKey: string;
  readonly downKey: string;
  readonly homeKey: string;
  readonly endKey: string;
  readonly pageUpKey: string;
  readonly pageDownKey: string;
}
export function navigator({
  element,
  scrollIntoView,
  gridId,
  position: cp,
  nextKey,
  prevKey,
  upKey,
  downKey,
  homeKey,
  endKey,
  pageDownKey,
  pageUpKey,
}: NavigatorParams) {
  const keys = new Set([nextKey, prevKey, endKey, homeKey, upKey, downKey, pageDownKey, pageUpKey]);

  const handleKey = (ev: KeyboardEvent) => {
    const key = ev.key;
    const shouldHandle = () => true; // Temp placeholder for eventual handle hook

    // First is determining if the key should be handled.
    // Handling the key will prevent any further navigation.
    if (!keys.has(key) || !shouldHandle()) return;

    const beforeKey = () => {
      // Placeholder for now
    };

    const afterKey = () => {
      ev.preventDefault();
      ev.stopPropagation();
    };

    // If the element itself is focused, then only the down key or next key should do something.
    // The element should be focusable. The idea is you tab to it and then use arrow keys to navigate
    // through the elements.
    if (element === getActiveElement(document)) {
      if (key !== nextKey && key !== downKey) return;

      beforeKey();
      // We need to focus the first element in the grid that can be focused. If the header element
      // is present, this will be the first header cell. However, it is perfectly reasonable for
      // a user to omit the header entirely, in which case the first cell should be focused. Hence we
      // have a three cases to handle:
      //   - We focus the first header cell if it is present (this could be a floating cell or group cell too)
      //   - We focus the grid cell if present (this could be a full-width row)
      //   - The grid is empty so we don't focus anything and just return
      // The viewport may have other focusable elements but if these aren't the normal elements the grid expects
      // then they should be ignored.
      const first = queryFirstFocusable(gridId, element);
      if (first) {
        first.focus();
        afterKey();
        return;
      }

      // We didn't find the first focusable element. It might not be in view due to some scroll. So let's
      // scroll things into view and then see if it becomes visible and try focus it. If it never becomes
      // focusable in the allotted time, then we just return. We've given ample time, so something else must've
      // intervened, in which case we should just give up on the focus. This should be relatively rare, if ever,
      // because it implies the user is performing an action faster than a frame can be displayed.
      scrollIntoView({
        row: queryHeader(gridId, element) ? 0 : undefined,
        column: 0,
        behavior: "instant",
      });

      runWithBackoff(() => {
        const first = queryFirstFocusable(gridId, element);
        if (first) {
          first.focus();
          afterKey();
          return true;
        }

        return false;
      }, [8, 16, 32, 64, 128]);

      return;
    }

    // Grab our current position. This must be tracked with the focus tracker.
    // determine our current position. The current may be null, in which case we do nothing,
    // the user is assumed to know what they are doing.
    const current = cp.get();
    if (!current) return;

    // At this point we have ways to handle the navigation depending on the key being pressed.
    if (key === nextKey || key === prevKey) {
      //
    } else if (key === upKey || key === downKey) {
      //
    }
  };

  return handleKey;
}
