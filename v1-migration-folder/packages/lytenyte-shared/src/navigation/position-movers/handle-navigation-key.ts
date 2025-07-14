import { getFirstTabbable } from "@1771technologies/lytenyte-dom-utils";
import { handlePageUpDown } from "./handle-page-up-down";
import { handleHomeEnd } from "./handle-home-end";
import { handleHorizontalArrow } from "./handle-horizontal-arrow";
import { handleVerticalArrow } from "./handle-vertical-arrow";
import { ensureVisible } from "@1771technologies/lytenyte-shared";
import type { GridAtom, PositionUnion } from "../../+types";
import type { LayoutMap, ScrollIntoViewFn } from "../../+types.non-gen";

interface Args {
  readonly vp: HTMLElement | null;
  readonly rowCount: number;
  readonly columnCount: number;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly focusActive: GridAtom<PositionUnion | null>;
  readonly id: string;
  readonly layout: LayoutMap;
  readonly rtl: boolean;
  readonly topCount: number;
  readonly centerCount: number;
}

interface Event {
  readonly key: string;
  readonly preventDefault: () => void;
  readonly stopPropagation: () => void;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
}

export function handleNavigationKeys(e: Event, args: Args) {
  const keys = [
    "ArrowRight",
    "ArrowLeft",
    "ArrowDown",
    "ArrowUp",
    "Home",
    "End",
    "PageUp",
    "PageDown",
  ];

  if (!keys.includes(e.key)) return;
  e.preventDefault();
  e.stopPropagation();

  const pos = args.focusActive.get();
  if (!pos) {
    const rtl = args.rtl;

    const condition =
      e.key === "ArrowDown" || (rtl ? e.key === "ArrowLeft" : e.key === "ArrowRight");

    if (condition) {
      const first = getFirstTabbable(args.vp!);
      if (first) {
        ensureVisible(first, args.scrollIntoView);
        first.focus();
      }
    }

    return;
  }

  args.scrollIntoView({
    column: pos.colIndex,
    row: (pos as any).rowIndex,
    behavior: "instant",
  });

  const isMeta = e.ctrlKey || e.metaKey;

  setTimeout(() => {
    switch (e.key) {
      case "PageDown":
      case "PageUp": {
        const isUp = e.key === "PageUp";
        handlePageUpDown({ ...args, pos, isUp });
        break;
      }
      case "End":
      case "Home": {
        const isStart = e.key === "Home";

        handleHomeEnd({ ...args, pos, isStart, isMeta });
        break;
      }
      case "ArrowLeft":
      case "ArrowRight": {
        const isForward = args.rtl ? e.key === "ArrowLeft" : e.key === "ArrowRight";
        handleHorizontalArrow({ ...args, pos, isForward, isMeta: e.ctrlKey || e.metaKey });
        break;
      }
      case "ArrowUp":
      case "ArrowDown": {
        handleVerticalArrow({
          ...args,
          pos,
          isDown: e.key === "ArrowDown",
          isMeta: e.ctrlKey || e.metaKey,
        });
        break;
      }
    }
  }, 4);
}
