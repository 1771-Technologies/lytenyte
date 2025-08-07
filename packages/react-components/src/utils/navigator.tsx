import { getFocusables, getTabbables } from "@1771technologies/lytenyte-dom-utils";
import { type FocusEvent, type KeyboardEvent } from "react";

export interface MakeNavigateArgs {
  readonly nextKey?: string;
  readonly prevKey?: string;
  readonly noopOnLast?: boolean;
  readonly noopOnFirst?: boolean;
  readonly includeFocusables?: boolean;
  readonly elementFilter?: (el: HTMLElement, container: HTMLElement) => boolean;

  readonly focusFirst?: boolean;
}

export const makeNavigate = ({
  nextKey = "ArrowRight",
  prevKey = "ArrowLeft",
  noopOnFirst = false,
  noopOnLast = false,

  includeFocusables,

  elementFilter = () => true,
}: MakeNavigateArgs = {}) => {
  const handleKeyDown = (ev: KeyboardEvent<HTMLElement>) => {
    handleTab(ev);

    if (ev.ctrlKey || ev.metaKey || ev.shiftKey || (ev.key !== nextKey && ev.key !== prevKey)) {
      return;
    }

    const isNext = ev.key === nextKey;

    const allElements = includeFocusables
      ? getFocusables(ev.currentTarget)
      : getTabbables(ev.currentTarget);

    const elements = allElements.filter((c) => elementFilter(c as HTMLElement, ev.currentTarget));

    let activeIndex = elements.indexOf(document.activeElement as HTMLElement);
    if (activeIndex === -1)
      activeIndex = elements.findIndex((c) => c.contains(document.activeElement));

    const isAtEnd = activeIndex === elements.length - 1;
    const isAtStart = activeIndex === 0;

    if (isAtEnd && isNext && noopOnLast) return;
    if (isAtStart && !isNext && noopOnFirst) return;

    ev.stopPropagation();
    ev.preventDefault();
    const nextIndex =
      activeIndex === -1
        ? isNext
          ? 0
          : -1
        : isNext
          ? (activeIndex + 1) % elements.length
          : activeIndex - 1;

    elements.at(nextIndex)?.focus();
  };
  const handleFocus = (ev: FocusEvent<HTMLElement>) => {
    if (!ev.relatedTarget || (ev.relatedTarget && ev.currentTarget.contains(ev.relatedTarget))) {
      return;
    }

    ev.currentTarget.focus();
  };

  return {
    handleKeyDown,
    handleFocus,
  };
};

const handleTab = (ev: KeyboardEvent<HTMLElement>) => {
  if (ev.key !== "Tab" || ev.ctrlKey || ev.metaKey) return;

  const elements = getTabbables(ev.currentTarget);
  const reset = elements.map((el) => {
    const c = el.getAttribute("tabindex");
    el.tabIndex = -1;
    return c;
  });

  setTimeout(() => {
    elements.forEach((el, i) => {
      if (reset[i] == null) {
        el.removeAttribute("tabindex");
        return;
      }
      el.setAttribute("tabindex", `${reset[i]}`);
    });
  });
};
