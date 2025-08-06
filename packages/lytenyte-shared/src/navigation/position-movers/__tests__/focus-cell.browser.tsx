import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { CellReact } from "../../../renderer-react/cell";
import { RowReact } from "../../../renderer-react/row";
import { focusCell } from "../focus-cell";
import type { PositionFullWidthRow, PositionUnion } from "../../../+types";
import { makeGridAtom } from "../../../grid-atom/make-grid-atom";
import { atom, createStore } from "@1771technologies/atom";
import type { LayoutMap } from "../../../+types.non-gen";
import { FULL_WIDTH_MAP } from "../../../+constants";
import { RowFullWidthReact } from "../../../renderer-react/row-full-width";

describe("focusCell", () => {
  test("should correctly focus a cell", async () => {
    const layout = new Map([
      [2, new Map([[2, 0]])],
      [4, FULL_WIDTH_MAP] as any,
      [6, new Map([[2, 0]])] as any,
    ]) as unknown as LayoutMap;

    const scroll = vi.fn();

    const s = render(
      <div data-testid="vp">
        <RowReact
          gridId="x"
          rowIndex={2}
          rowFirstPinBottom={false}
          rowIsFocusRow={false}
          rowLastPinTop={false}
          accepted={[]}
          yPositions={new Uint32Array([0, 100, 200, 300, 400])}
        >
          <CellReact
            data-testid="cell"
            cell={{ colIndex: 0, rowIndex: 2, colSpan: 1, rowSpan: 1 }}
            detailHeight={0}
            isEditing={false}
            rtl={false}
            viewportWidth={0}
            xPosition={new Uint32Array([0, 100, 200, 300, 400])}
            yPosition={new Uint32Array([0, 100, 200, 300, 400])}
          />
        </RowReact>
      </div>,
    );

    const store = createStore();
    const focusActive = makeGridAtom(
      atom<PositionUnion | null>({
        colIndex: 2,
        kind: "full-width",
        rowIndex: 0,
      } satisfies PositionFullWidthRow),
      store,
    );
    const vp = s.getByTestId("vp").element() as HTMLElement;

    focusCell({
      layout,
      colIndex: 0,
      focusActive,
      id: "x",
      rowIndex: 2,
      scrollIntoView: scroll,
      vp,
      postFocus: vi.fn(),
    });

    await expect.element(s.getByTestId("cell")).toHaveFocus();

    expect(
      focusCell({
        layout,
        colIndex: 0,
        focusActive,
        id: "x",
        rowIndex: 2,
        scrollIntoView: scroll,
        vp: null,
      }),
    ).toEqual(false);

    focusCell({
      layout,
      colIndex: 0,
      focusActive,
      id: "x",
      rowIndex: 4,
      scrollIntoView: scroll,
      vp,
    });
    focusCell({
      layout,
      colIndex: 0,
      focusActive,
      id: "x",
      rowIndex: 6,
      scrollIntoView: scroll,
      vp,
    });

    await expect.element(s.getByTestId("cell")).toHaveFocus();
  });

  test("should correctly focus a cell for a full width row", async () => {
    const layout = new Map([
      [2, FULL_WIDTH_MAP],
      [4, FULL_WIDTH_MAP] as any,
    ]) as unknown as LayoutMap;

    const scroll = vi.fn();

    const s = render(
      <div data-testid="vp">
        <RowFullWidthReact
          accepted={[]}
          detail={<></>}
          detailHeight={0}
          gridId="x"
          data-testid="cell"
          rowFirstPinBottom={false}
          rowIndex={2}
          rowIsFocusRow={false}
          rowLastPinTop={false}
          rtl={false}
          yPositions={new Uint32Array([0, 100, 200, 300, 400])}
        />
      </div>,
    );

    const store = createStore();
    const focusActive = makeGridAtom(
      atom<PositionUnion | null>({
        colIndex: 2,
        kind: "full-width",
        rowIndex: 0,
      } satisfies PositionFullWidthRow),
      store,
    );
    const vp = s.getByTestId("vp").element() as HTMLElement;

    focusCell({
      layout,
      colIndex: 0,
      focusActive,
      id: "x",
      rowIndex: 2,
      scrollIntoView: scroll,
      vp,
      postFocus: vi.fn(),
    });

    await expect.element(s.getByTestId("cell")).toHaveFocus();

    expect(
      focusCell({
        layout,
        colIndex: 0,
        focusActive,
        id: "x",
        rowIndex: 2,
        scrollIntoView: scroll,
        vp: null,
      }),
    ).toEqual(false);

    focusCell({
      layout,
      colIndex: 0,
      focusActive,
      id: "x",
      rowIndex: 4,
      scrollIntoView: scroll,
      vp,
    });

    focusCell({
      layout,
      colIndex: 0,
      focusActive,
      id: "x",
      rowIndex: 1,
      scrollIntoView: scroll,
      vp,
    });

    await expect.element(s.getByTestId("cell")).toHaveFocus();
  });
});
