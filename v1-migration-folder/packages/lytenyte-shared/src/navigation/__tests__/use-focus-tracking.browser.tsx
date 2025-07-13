import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { useFocusTracking } from "../use-focus-tracking";
import { atom, createStore } from "@1771technologies/atom";
import { makeGridAtom } from "../../grid-atom/make-grid-atom";
import type { PositionUnion } from "../../+types";
import { useState } from "react";
import { userEvent } from "@vitest/browser/context";

describe("useFocusTracking", () => {
  test("should correctly track the focus of the cell", async () => {
    const store = createStore();
    const focusActive = makeGridAtom(atom<PositionUnion | null>(null), store);

    function Render() {
      const [vp, setVp] = useState<HTMLDivElement | null>(null);

      const focused = useFocusTracking(vp, focusActive);

      return (
        <>
          <div data-testid="vp" ref={setVp} data-ln-focused={focused}>
            <div tabIndex={0} data-ln-header-cell data-ln-colindex={1}>
              Header
            </div>
            <div
              tabIndex={0}
              data-ln-header-group
              data-ln-rowindex={2}
              data-ln-colindex={3}
              data-ln-colspan={2}
            >
              Group
            </div>
            <div
              tabIndex={0}
              data-ln-cell
              data-ln-rowindex={2}
              data-ln-colindex={3}
              data-ln-colspan={2}
              data-ln-rowspan={2}
            >
              Cell
            </div>
            <div tabIndex={0} data-ln-row data-ln-rowtype="full-width" data-ln-rowindex={2}>
              Full Width
            </div>
            <div tabIndex={0}>None</div>
          </div>
          <div tabIndex={0}>Click Me</div>
        </>
      );
    }

    const screen = render(<Render />);

    const vp = screen.getByTestId("vp");
    await expect.element(vp).toHaveAttribute("data-ln-focused", "false");

    await userEvent.click(screen.getByText("Header"));
    await expect.element(screen.getByText("Header")).toHaveFocus();
    expect(focusActive.get()).toMatchInlineSnapshot(`
      {
        "colIndex": 1,
        "kind": "header-cell",
      }
    `);

    await userEvent.keyboard("{Tab}");
    await expect.element(screen.getByText("Group")).toHaveFocus();
    expect(focusActive.get()).toMatchInlineSnapshot(`
      {
        "colIndex": 3,
        "columnEndIndex": 5,
        "columnStartIndex": 3,
        "hierarchyRowIndex": 2,
        "kind": "header-group-cell",
      }
    `);

    await userEvent.keyboard("{Tab}");
    await expect.element(screen.getByText("Cell")).toHaveFocus();
    expect(focusActive.get()).toMatchInlineSnapshot(`
      {
        "colIndex": 3,
        "kind": "cell",
        "root": {
          "colIndex": 3,
          "colSpan": 2,
          "rowIndex": 2,
          "rowSpan": 2,
        },
        "rowIndex": 2,
      }
    `);

    await userEvent.keyboard("{Tab}");
    await expect.element(screen.getByText("Full Width")).toHaveFocus();
    expect(focusActive.get()).toMatchInlineSnapshot(`
      {
        "colIndex": 0,
        "kind": "full-width",
        "rowIndex": 2,
      }
    `);

    await userEvent.keyboard("{Tab}");
    await expect.element(screen.getByText("Full Width")).not.toHaveFocus();
    expect(focusActive.get()).toMatchInlineSnapshot(`null`);

    await userEvent.keyboard("{Tab}");
    expect(focusActive.get()).toMatchInlineSnapshot(`null`);

    await userEvent.click(screen.getByText("Header"));
    await expect.element(screen.getByText("Header")).toHaveFocus();

    vi.spyOn(document, "hasFocus").mockImplementationOnce(() => false);

    const el = screen.getByText("Header").element() as HTMLElement;
    el.blur();
    await expect.element(screen.getByText("Header")).not.toHaveFocus();

    expect(focusActive.get()).toMatchInlineSnapshot(`
      {
        "colIndex": 1,
        "kind": "header-cell",
      }
    `);

    vi.clearAllMocks();
  });
});
