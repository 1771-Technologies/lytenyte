import { atom, createStore } from "@1771technologies/atom";
import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { makeGridAtom } from "../../../grid-atom/make-grid-atom";
import type { PositionFullWidthRow, PositionGridCell, PositionUnion } from "../../../+types";
import { RowReact } from "../../../renderer-react/row";
import { CellReact } from "../../../renderer-react/cell";
import { handleHomeEnd } from "../handle-home-end";
import type { LayoutMap } from "../../../+types.non-gen";
import { RowFullWidthReact } from "../../../renderer-react/row-full-width";
import { FULL_WIDTH_MAP } from "../../../+constants";

describe("handleHomeEnd", () => {
  test("should focus the correct cells", async () => {
    const s = render(
      <div data-testid="vp">
        <RowReact
          gridId="x"
          rowFirstPinBottom={false}
          rowIndex={0}
          rowIsFocusRow={false}
          rowLastPinTop={false}
          yPositions={new Uint32Array([0, 100, 200, 300])}
        >
          <CellReact
            cell={{
              colIndex: 0,
              colSpan: 1,
              rowIndex: 0,
              rowSpan: 1,
            }}
            data-testid="first"
            detailHeight={0}
            isEditing={false}
            rtl={false}
            viewportWidth={1000}
            xPosition={new Uint32Array([0, 100, 200, 300])}
            yPosition={new Uint32Array([0, 100, 200, 300])}
          />
          <CellReact
            cell={{
              colIndex: 1,
              colSpan: 1,
              rowIndex: 0,
              rowSpan: 1,
            }}
            detailHeight={0}
            isEditing={false}
            rtl={false}
            viewportWidth={1000}
            data-testid="middle"
            xPosition={new Uint32Array([0, 100, 200, 300])}
            yPosition={new Uint32Array([0, 100, 200, 300])}
          />
          <CellReact
            cell={{
              colIndex: 2,
              colSpan: 1,
              rowIndex: 0,
              rowSpan: 1,
            }}
            detailHeight={0}
            isEditing={false}
            rtl={false}
            viewportWidth={1000}
            data-testid="last"
            xPosition={new Uint32Array([0, 100, 200, 300])}
            yPosition={new Uint32Array([0, 100, 200, 300])}
          />
        </RowReact>
      </div>,
    );

    const store = createStore();
    const focusActive = makeGridAtom(
      atom<PositionUnion | null>({
        colIndex: 1,
        rowIndex: 0,
        root: null,
        kind: "cell",
      } satisfies PositionGridCell),
      store,
    );
    const vp = s.getByTestId("vp").element() as HTMLElement;

    const map = new Map([
      [0, [0, 0]],
      [1, [0, 1]],
      [2, [0, 2]],
    ]);

    const layout = new Map([
      [0, map],
      [2, map],
    ]) as LayoutMap;

    handleHomeEnd({
      rowCount: 1,
      columnCount: 3,
      focusActive,
      id: "x",
      isMeta: false,
      isStart: false,
      layout,
      vp,
      pos: focusActive.get()!,
      scrollIntoView: vi.fn(),
    });

    await expect.element(s.getByTestId("last")).toHaveFocus();

    handleHomeEnd({
      rowCount: 1,
      columnCount: 3,
      focusActive,
      id: "x",
      isMeta: false,
      isStart: true,
      layout,
      vp,
      pos: focusActive.get()!,
      scrollIntoView: vi.fn(),
    });
    await expect.element(s.getByTestId("first")).toHaveFocus();

    // Handle meta true and start false
    handleHomeEnd({
      rowCount: 1,
      columnCount: 3,
      focusActive,
      id: "x",
      isMeta: true,
      isStart: false,
      layout,
      vp,
      pos: focusActive.get()!,
      scrollIntoView: vi.fn(),
    });
    await expect.element(s.getByTestId("last")).toHaveFocus();

    // Handle meta true and start true
    handleHomeEnd({
      rowCount: 1,
      columnCount: 3,
      focusActive,
      id: "x",
      isMeta: true,
      isStart: true,
      layout,
      vp,
      pos: focusActive.get()!,
      scrollIntoView: vi.fn(),
    });
    await expect.element(s.getByTestId("first")).toHaveFocus();

    // Handle the case when the row is not present in layout at all
    handleHomeEnd({
      rowCount: 1,
      columnCount: 3,
      focusActive,
      id: "x",
      isMeta: false,
      isStart: false,
      layout,
      vp,
      pos: { kind: "cell", rowIndex: 1, colIndex: 2, root: null },
      scrollIntoView: vi.fn(),
    });

    await expect.element(s.getByTestId("first")).toHaveFocus();

    // Handle the case when the row is present in layout but not actually rendered
    handleHomeEnd({
      rowCount: 1,
      columnCount: 3,
      focusActive,
      id: "x",
      isMeta: false,
      isStart: false,
      layout,
      vp,
      pos: { kind: "cell", rowIndex: 2, colIndex: 2, root: null },
      scrollIntoView: vi.fn(),
    });

    await expect.element(s.getByTestId("first")).toHaveFocus();
  });

  test("should handle full width row", async () => {
    const s = render(
      <div data-testid="vp">
        <RowFullWidthReact
          gridId="x"
          detail={<></>}
          detailHeight={0}
          data-testid="row"
          rowIndex={0}
          rowFirstPinBottom={false}
          rowIsFocusRow={false}
          rowLastPinTop={false}
          rtl={false}
          yPositions={new Uint32Array([0, 100, 200, 300])}
        />
      </div>,
    );

    const store = createStore();
    const focusActive = makeGridAtom(
      atom<PositionUnion | null>({
        colIndex: 1,
        rowIndex: 0,
        kind: "full-width",
      } satisfies PositionFullWidthRow),
      store,
    );
    const vp = s.getByTestId("vp").element() as HTMLElement;

    const layout = new Map([
      [0, FULL_WIDTH_MAP],
      [2, FULL_WIDTH_MAP],
    ]) as LayoutMap;

    handleHomeEnd({
      rowCount: 1,
      columnCount: 3,
      focusActive,
      id: "x",
      isMeta: false,
      isStart: false,
      layout,
      vp,
      pos: focusActive.get()!,
      scrollIntoView: vi.fn(),
    });

    await expect.element(s.getByTestId("row")).toHaveFocus();

    handleHomeEnd({
      rowCount: 1,
      columnCount: 3,
      focusActive,
      id: "x",
      isMeta: false,
      isStart: false,
      layout,
      vp,
      pos: { kind: "full-width", rowIndex: 2, colIndex: 2 },
      scrollIntoView: vi.fn(),
    });

    await expect.element(s.getByTestId("row")).toHaveFocus();
  });

  test("should return immediately if the position is not a row position", () => {
    const s = render(
      <div data-testid="vp">
        <RowFullWidthReact
          gridId="x"
          detail={<></>}
          detailHeight={0}
          data-testid="row"
          rowIndex={0}
          rowFirstPinBottom={false}
          rowIsFocusRow={false}
          rowLastPinTop={false}
          rtl={false}
          yPositions={new Uint32Array([0, 100, 200, 300])}
        />
      </div>,
    );

    const store = createStore();
    const focusActive = makeGridAtom(
      atom<PositionUnion | null>({
        colIndex: 1,
        rowIndex: 0,
        kind: "full-width",
      } satisfies PositionFullWidthRow),
      store,
    );
    const vp = s.getByTestId("vp").element() as HTMLElement;

    const layout = new Map([
      [0, FULL_WIDTH_MAP],
      [2, FULL_WIDTH_MAP],
    ]) as LayoutMap;

    handleHomeEnd({
      rowCount: 1,
      columnCount: 3,
      focusActive,
      id: "x",
      isMeta: false,
      isStart: false,
      layout,
      vp,
      pos: { kind: "header-cell", colIndex: 2 },
      scrollIntoView: vi.fn(),
    });
  });
});
