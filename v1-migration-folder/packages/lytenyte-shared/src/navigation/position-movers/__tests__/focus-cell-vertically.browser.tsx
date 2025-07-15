import { describe, expect, test, vi } from "vitest";
import { focusCellVertically } from "../focus-cell-vertically";
import { makeGridAtom } from "../../../grid-atom/make-grid-atom";
import { atom, createStore } from "@1771technologies/atom";
import type { PositionFullWidthRow, PositionUnion } from "../../../+types";
import { render } from "vitest-browser-react";
import { RowFullWidthReact } from "../../../renderer-react/row-full-width";
import { FULL_WIDTH_MAP } from "../../../+constants";
import { RowReact } from "../../../renderer-react/row";
import { CellReact } from "../../../renderer-react/cell";

describe("focusCellVertically", () => {
  test("should handle vertical focusing when the layout is not present", () => {
    const store = createStore();
    const focusActive = makeGridAtom(atom<PositionUnion | null>(null), store);
    expect(
      focusCellVertically({
        id: "0",
        focusActive,
        layout: new Map(),
        nextRow: 0,
        pos: focusActive.get()!,
        scrollIntoView: () => {},
        vp: null,
      }),
    ).toEqual(false);
  });

  test("should handle vertical focusing when the layout is present", async () => {
    const store = createStore();
    const focusActive = makeGridAtom(
      atom<PositionUnion | null>({
        colIndex: 2,
        kind: "full-width",
        rowIndex: 0,
      } satisfies PositionFullWidthRow),
      store,
    );

    const s = render(
      <div data-testid="test">
        <RowFullWidthReact
          detail={<></>}
          detailHeight={0}
          gridId="x"
          rowFirstPinBottom={false}
          rowIndex={0}
          rowIsFocusRow={false}
          rowLastPinTop={false}
          rtl={false}
          yPositions={new Uint32Array([0, 100, 200, 300])}
        />
        <RowFullWidthReact
          detail={<></>}
          data-testid="second"
          detailHeight={0}
          gridId="x"
          rowFirstPinBottom={false}
          rowIndex={1}
          rowIsFocusRow={false}
          rowLastPinTop={false}
          rtl={false}
          yPositions={new Uint32Array([0, 100, 200, 300])}
        ></RowFullWidthReact>
      </div>,
    );

    const vp = s.getByTestId("test").element() as HTMLElement;

    const scroll = vi.fn();
    focusCellVertically({
      focusActive,
      id: "x",
      layout: new Map([
        [0, FULL_WIDTH_MAP],
        [1, FULL_WIDTH_MAP],
      ]),
      nextRow: 1,
      pos: focusActive.get()!,
      scrollIntoView: scroll,
      vp,
    });

    await expect.element(s.getByTestId("second")).toHaveFocus();

    // Shouldn't move focus if the viewport is not defined
    focusCellVertically({
      focusActive,
      id: "x",
      layout: new Map([
        [0, FULL_WIDTH_MAP],
        [1, FULL_WIDTH_MAP],
      ]),
      nextRow: 1,
      pos: focusActive.get()!,
      scrollIntoView: scroll,
      vp: null,
    });
    await expect.element(s.getByTestId("second")).toHaveFocus();

    expect(focusActive.get()?.colIndex).toEqual(2);
  });

  test("should handle cell focus", async () => {
    const store = createStore();
    const focusActive = makeGridAtom(
      atom<PositionUnion | null>({
        colIndex: 2,
        kind: "full-width",
        rowIndex: 0,
      } satisfies PositionFullWidthRow),
      store,
    );

    const s = render(
      <div data-testid="test">
        <RowReact
          gridId="x"
          rowFirstPinBottom={false}
          rowIndex={0}
          rowIsFocusRow={false}
          rowLastPinTop={false}
          yPositions={new Uint32Array([0, 100, 200, 300])}
        >
          <CellReact
            data-testid="cell"
            cell={{
              colIndex: 2,
              rowIndex: 0,
              colSpan: 1,
              rowSpan: 2,
            }}
            detailHeight={0}
            isEditing={false}
            rtl={false}
            viewportWidth={1000}
            xPosition={new Uint32Array([0, 100, 200, 300])}
            yPosition={new Uint32Array([0, 100, 200, 300])}
          />
        </RowReact>
        <RowFullWidthReact
          detail={<></>}
          data-testid="second"
          detailHeight={0}
          gridId="x"
          rowFirstPinBottom={false}
          rowIndex={1}
          rowIsFocusRow={false}
          rowLastPinTop={false}
          rtl={false}
          yPositions={new Uint32Array([0, 100, 200, 300])}
        ></RowFullWidthReact>
      </div>,
    );

    const vp = s.getByTestId("test").element() as HTMLElement;
    const scroll = vi.fn();
    focusCellVertically({
      id: "x",
      focusActive,
      layout: new Map([[0, new Map([[2, [0, 2]]])]]),
      nextRow: 0,
      pos: { kind: "full-width", rowIndex: 1, colIndex: 2 },
      scrollIntoView: scroll,
      vp,
    });
    await expect.element(s.getByTestId("cell")).toHaveFocus();
    focusCellVertically({
      id: "x",
      focusActive,
      layout: new Map([[0, new Map([[2, [0, 2]]])]]),
      nextRow: 0,
      pos: { kind: "full-width", rowIndex: 1, colIndex: 2 },
      scrollIntoView: scroll,
      vp: null,
    });
    await expect.element(s.getByTestId("cell")).toHaveFocus();
  });
});
