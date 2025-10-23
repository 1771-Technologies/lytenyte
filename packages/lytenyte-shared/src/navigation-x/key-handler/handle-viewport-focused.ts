import type { AfterKeyFn, BeforeKeyFn } from "../+types";
import type { ScrollIntoViewFn } from "../../+types.non-gen";
import { runWithBackoff } from "../../js-utils/index.js";
import { BACKOFF_RUNS } from "../constants.js";
import { queryFirstFocusable, queryHeader } from "../query.js";

export interface HandleViewportFocusedParams {
  scrollIntoView: ScrollIntoViewFn;
  gridId: string;
  viewport: HTMLElement;
  beforeKey: BeforeKeyFn;
  afterKey: AfterKeyFn;
}

export function handleViewportFocused({
  beforeKey,
  afterKey,
  gridId,
  viewport,
  scrollIntoView,
}: HandleViewportFocusedParams) {
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
  const first = queryFirstFocusable(gridId, viewport);
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
    row: queryHeader(gridId, viewport) ? 0 : undefined,
    column: 0,
    behavior: "instant",
  });

  runWithBackoff(() => {
    const first = queryFirstFocusable(gridId, viewport);
    if (first) {
      first.focus();
      afterKey();
      return true;
    }

    return false;
  }, BACKOFF_RUNS());

  return;
}
