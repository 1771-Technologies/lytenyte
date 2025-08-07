import { atom, createStore } from "@1771technologies/atom";
import { describe, expect, test, vi } from "vitest";
import { makeGridAtom } from "../../../grid-atom/make-grid-atom.js";
import type { PositionGridCell, PositionUnion } from "../../../+types.js";
import { handleNavigationKeys } from "../handle-navigation-key.js";
import { sleep } from "@1771technologies/lytenyte-js-utils";

describe("handleNavigationKeys", () => {
  test("should handle the correct keys", async () => {
    const store = createStore();
    const focusActive = makeGridAtom(
      atom<PositionUnion | null>({
        colIndex: 0,
        rowIndex: 0,
        root: null,
        kind: "cell",
      } satisfies PositionGridCell),
      store,
    );

    const prevent = vi.fn();
    const stop = vi.fn();

    const vp = document.createElement("div");
    const cell = document.createElement("div");
    cell.tabIndex = 0;
    cell.setAttribute("data-ln-cell", "true");
    vp.appendChild(cell);

    const args = {
      centerCount: 3,
      columnCount: 3,
      focusActive,
      id: "x",
      layout: new Map(),
      rowCount: 3,
      rtl: false,
      scrollIntoView: vi.fn(),
      topCount: 0,
      vp,
    };
    handleNavigationKeys(
      {
        ctrlKey: false,
        metaKey: false,
        key: "ArrowUp",
        preventDefault: prevent,
        stopPropagation: stop,
      },
      args,
    );
    expect(prevent).toHaveBeenCalledOnce();
    expect(stop).toHaveBeenCalledOnce();

    handleNavigationKeys(
      {
        ctrlKey: false,
        metaKey: false,
        key: "ArrowDown",
        preventDefault: prevent,
        stopPropagation: stop,
      },
      args,
    );
    handleNavigationKeys(
      {
        ctrlKey: false,
        metaKey: false,
        key: "PageDown",
        preventDefault: prevent,
        stopPropagation: stop,
      },
      args,
    );
    handleNavigationKeys(
      {
        ctrlKey: false,
        metaKey: false,
        key: "PageUp",
        preventDefault: prevent,
        stopPropagation: stop,
      },
      args,
    );
    handleNavigationKeys(
      {
        ctrlKey: false,
        metaKey: false,
        key: "Home",
        preventDefault: prevent,
        stopPropagation: stop,
      },
      args,
    );
    handleNavigationKeys(
      {
        ctrlKey: false,
        metaKey: false,
        key: "End",
        preventDefault: prevent,
        stopPropagation: stop,
      },
      args,
    );
    handleNavigationKeys(
      {
        ctrlKey: false,
        metaKey: false,
        key: "ArrowLeft",
        preventDefault: prevent,
        stopPropagation: stop,
      },
      args,
    );
    handleNavigationKeys(
      {
        ctrlKey: false,
        metaKey: false,
        key: "ArrowRight",
        preventDefault: prevent,
        stopPropagation: stop,
      },
      { ...args, rtl: true },
    );

    focusActive.set(null);
    handleNavigationKeys(
      {
        ctrlKey: false,
        metaKey: false,
        key: "ArrowRight",
        preventDefault: prevent,
        stopPropagation: stop,
      },
      { ...args, rtl: true },
    );
    handleNavigationKeys(
      {
        ctrlKey: false,
        metaKey: false,
        key: "ArrowLeft",
        preventDefault: prevent,
        stopPropagation: stop,
      },
      { ...args, rtl: false },
    );

    handleNavigationKeys(
      {
        ctrlKey: false,
        metaKey: false,
        key: "A",
        preventDefault: prevent,
        stopPropagation: stop,
      },
      { ...args, rtl: false },
    );

    document.body.appendChild(vp);

    handleNavigationKeys(
      {
        ctrlKey: false,
        metaKey: false,
        key: "ArrowDown",
        preventDefault: prevent,
        stopPropagation: stop,
      },
      { ...args, rtl: false },
    );

    await sleep(30);
  });
});
