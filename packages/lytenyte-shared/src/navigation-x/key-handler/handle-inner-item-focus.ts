import { getFirstTabbable, getFocusables, getLastTabbable, isTabbable } from "../../dom-utils/index.js";

export function handleInnerItemFocus(el: HTMLElement, active: HTMLElement, backward: boolean, loop: boolean) {
  // The container and the active are the same, hence we should focus the first tabbable if possible.
  if (el === active) {
    if (backward) {
      // If we are going backward, then loop must be set, otherwise we don't want to cycle through the elements.
      // We are on the first position, hence unless we are looping, there is no point in cycling through items.
      if (!loop) return false;

      const last = getLastTabbable(el);
      if (last) {
        last.focus();
        return false;
      }
    }

    // We are going forward. So let's get the first element and focus it. Otherwise this container has no
    // tabbable elements and we can return false.
    const first = getFirstTabbable(el);
    if (first) {
      first.focus();
      return true;
    }
    return false;
  }

  // If the container element does not contain the active element, then we should not really be focusing
  // anything. This violates the contract of this function, but its probably better not to throw an error,
  // and instead just no-op. Throwing an error could crash the page, and in reality the this isn't a critical
  // function.
  if (!el.contains(active)) return false;

  // The element may be focusable but not tabbable. In such cases we want to grab the first tabbable element
  // after (if moving forward) or before (if going backward). This can happen when our current active element has
  // a negative tab index. If the user focuses it, then uses the keyboard, the correct tab order should be maintained.
  const focusables = getFocusables(el);

  const currentIndex = focusables.indexOf(active);

  // If we are on the first index and going backward then focus the container if it is focusable,
  // otherwise return false to indicate we are not focusing on the cycle.
  if (currentIndex === 0 && backward) {
    if (isTabbable(el)) {
      el.focus();
      return true;
    }
    return false;
  }

  let nextTabbableIndex = -1;
  // We are going backward, so lets find the next tabbable index
  if (backward) {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (isTabbable(focusables[i])) {
        nextTabbableIndex = i;
        break;
      }
    }
  } else {
    for (let i = currentIndex + 1; i < focusables.length; i++) {
      if (isTabbable(focusables[i])) {
        nextTabbableIndex = i;
        break;
      }
    }
  }

  // We didn't find a next tabbable. This means we are at the end of our list (either forward or backward).
  // Hence if going backward we always focus the container if we can, however if going forward we should focus the
  // first element or container.
  if (nextTabbableIndex === -1 && backward) {
    if (isTabbable(el)) {
      el.focus();
      return true;
    }
    return false;
  } else if (nextTabbableIndex === -1 && loop) {
    const first = getFirstTabbable(el);
    if (first) {
      first.focus();
      return true;
    }
    return false;
  } else if (nextTabbableIndex === -1) {
    return false;
  } else {
    focusables[nextTabbableIndex].focus();
    return true;
  }
}
