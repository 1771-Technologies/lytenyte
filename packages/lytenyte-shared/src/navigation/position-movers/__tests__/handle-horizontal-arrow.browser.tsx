import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { RowReact } from "../../../renderer-react/row.js";
import { CellReact } from "../../../renderer-react/cell.js";
import { atom, createStore } from "@1771technologies/atom";
import { makeGridAtom } from "../../../grid-atom/make-grid-atom.js";
import type { PositionGridCell, PositionHeaderCell, PositionUnion } from "../../../+types.js";
import { userEvent } from "@vitest/browser/context";
import { handleHorizontalArrow } from "../handle-horizontal-arrow.js";
import type { LayoutMap } from "../../../+types.non-gen.js";
import { HeaderRowReact } from "../../../renderer-react/header-row.js";
import { HeaderCellReact } from "../../../renderer-react/header-cell.js";
import { HeaderReact } from "../../../renderer-react/header.js";
import { HeaderGroupCellReact } from "../../../renderer-react/header-group-cell.js";

describe("handleHorizontalArrow", () => {
  test("should focus positions correctly", async () => {
    const s = render(
      <div data-testid="vp">
        <RowReact
          gridId="x"
          rowFirstPinBottom={false}
          rowIndex={0}
          accepted={[]}
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
          >
            <button>A</button>
            <button>B</button>
          </CellReact>

          <CellReact
            cell={{
              colIndex: 1,
              colSpan: 1,
              rowIndex: 0,
              rowSpan: 1,
            }}
            data-testid="center"
            detailHeight={0}
            isEditing={false}
            rtl={false}
            viewportWidth={1000}
            xPosition={new Uint32Array([0, 100, 200, 300])}
            yPosition={new Uint32Array([0, 100, 200, 300])}
          >
            <button>X</button>
            <button>Y</button>
          </CellReact>

          <CellReact
            cell={{
              colIndex: 2,
              colSpan: 1,
              rowIndex: 0,
              rowSpan: 1,
            }}
            data-testid="last"
            detailHeight={0}
            isEditing={false}
            rtl={false}
            viewportWidth={1000}
            xPosition={new Uint32Array([0, 100, 200, 300])}
            yPosition={new Uint32Array([0, 100, 200, 300])}
          >
            Cell
          </CellReact>
        </RowReact>
      </div>,
    );

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
    const vp = s.getByTestId("vp").element() as HTMLElement;

    await userEvent.click(s.getByTestId("first"));
    await expect.element(s.getByTestId("first")).toHaveFocus();

    const map = new Map([
      [0, [0, 0]],
      [1, [0, 1]],
      [2, [0, 2]],
      [3, [0, 3]],
    ]);

    const layout = new Map([
      [0, map],
      // [2, map],
    ]) as LayoutMap;

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout,
      id: "x",
      isForward: true,
      isMeta: false,
      pos: focusActive.get()!,
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByText("A")).toHaveFocus();

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout,
      id: "x",
      isForward: true,
      isMeta: false,
      pos: focusActive.get()!,
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByText("B")).toHaveFocus();

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout,
      id: "x",
      isForward: true,
      isMeta: false,
      pos: focusActive.get()!,
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("center")).toHaveFocus();

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout,
      id: "x",
      isForward: true,
      isMeta: false,
      pos: focusActive.get()!,
      scrollIntoView: vi.fn(),
      vp,
    });
    await expect.element(s.getByText("X")).toHaveFocus();

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout,
      id: "x",
      isForward: true,
      isMeta: false,
      pos: focusActive.get()!,
      scrollIntoView: vi.fn(),
      vp,
    });
    await expect.element(s.getByText("Y")).toHaveFocus();

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout,
      id: "x",
      isForward: true,
      isMeta: false,
      pos: { kind: "cell", rowIndex: 0, colIndex: 1, root: null },
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("last")).toHaveFocus();

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout,
      id: "x",
      isForward: false,
      isMeta: false,
      pos: { kind: "cell", rowIndex: 0, colIndex: 2, root: null },
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByText("Y")).toHaveFocus();

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout,
      id: "x",
      isForward: false,
      isMeta: false,
      pos: { kind: "cell", rowIndex: 0, colIndex: 1, root: null },
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByText("X")).toHaveFocus();

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout,
      id: "x",
      isForward: false,
      isMeta: false,
      pos: { kind: "cell", rowIndex: 0, colIndex: 1, root: null },
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("center")).toHaveFocus();

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout,
      id: "x",
      isForward: false,
      isMeta: false,
      pos: { kind: "full-width", rowIndex: 0, colIndex: 1 },
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("center")).toHaveFocus();

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout,
      id: "x",
      isForward: false,
      isMeta: false,
      pos: {
        kind: "cell",
        rowIndex: 0,
        colIndex: 1,
        root: { colIndex: 0, rowIndex: 0, colSpan: 1, rowSpan: 1 },
      },
      scrollIntoView: vi.fn(),
      vp,
    });

    (s.getByTestId("last").element() as HTMLElement).focus();

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout,
      id: "x",
      isForward: true,
      isMeta: false,
      pos: {
        kind: "cell",
        rowIndex: 0,
        colIndex: 1,
        root: { colIndex: 2, rowIndex: 0, colSpan: 1, rowSpan: 1 },
      },
      scrollIntoView: vi.fn(),
      vp,
    });

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout,
      id: "x",
      isForward: true,
      isMeta: true,
      pos: {
        kind: "cell",
        rowIndex: 0,
        colIndex: 1,
        root: { colIndex: 2, rowIndex: 0, colSpan: 1, rowSpan: 1 },
      },
      scrollIntoView: vi.fn(),
      vp,
    });

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout,
      id: "x",
      isForward: false,
      isMeta: true,
      pos: {
        kind: "cell",
        rowIndex: 0,
        colIndex: 1,
        root: { colIndex: 2, rowIndex: 0, colSpan: 1, rowSpan: 1 },
      },
      scrollIntoView: vi.fn(),
      vp,
    });

    handleHorizontalArrow({
      columnCount: 4,
      focusActive,
      layout,
      id: "x",
      isForward: true,
      isMeta: true,
      pos: {
        kind: "cell",
        rowIndex: 0,
        colIndex: 2,
        root: null,
      },
      scrollIntoView: vi.fn(),
      vp,
    });
  });

  test("should handle focus for headers", async () => {
    const s = render(
      <div data-testid="vp">
        <HeaderReact
          floatingRowEnabled={false}
          floatingRowHeight={20}
          headerGroupHeight={20}
          headerHeight={20}
          rows={2}
          width={1000}
        >
          <HeaderRowReact headerRowIndex={0} maxRow={1}>
            <HeaderGroupCellReact
              isHiddenMove={false}
              cell={{
                colStart: 0,
                colEnd: 1,
                colSpan: 3,
                colPin: null,
                rowStart: 0,
                rowEnd: 1,
              }}
              cellId="x"
              height={100}
              rtl={false}
              viewportWidth={100}
              xPositions={new Uint32Array([0, 100, 200])}
            />
          </HeaderRowReact>
          <HeaderRowReact headerRowIndex={0} maxRow={1}>
            <HeaderCellReact
              cell={{
                rowStart: 0,
                rowEnd: 1,
                colStart: 0,
                colEnd: 1,
                colPin: null,
                colSpan: 1,
              }}
              data-testid="first"
              columnId="x"
              isFloating={false}
              rtl={false}
              viewportWidth={1000}
              xPositions={new Uint32Array([0, 100, 200, 300, 400])}
            />

            <HeaderCellReact
              cell={{
                rowStart: 0,
                rowEnd: 1,
                colStart: 1,
                colEnd: 2,
                colPin: null,
                colSpan: 1,
              }}
              data-testid="center"
              columnId="x"
              isFloating={false}
              rtl={false}
              viewportWidth={1000}
              xPositions={new Uint32Array([0, 100, 200, 300, 400])}
            />

            <HeaderCellReact
              cell={{
                rowStart: 0,
                rowEnd: 1,
                colStart: 2,
                colEnd: 3,
                colPin: null,
                colSpan: 1,
              }}
              data-testid="last"
              columnId="x"
              isFloating={false}
              rtl={false}
              viewportWidth={1000}
              xPositions={new Uint32Array([0, 100, 200, 300, 400])}
            ></HeaderCellReact>
          </HeaderRowReact>
        </HeaderReact>
      </div>,
    );

    const store = createStore();
    const focusActive = makeGridAtom(
      atom<PositionUnion | null>({ colIndex: 0, kind: "header-cell" } satisfies PositionHeaderCell),
      store,
    );
    const vp = s.getByTestId("vp").element() as HTMLElement;

    (s.getByTestId("first").element() as HTMLElement).focus();

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout: new Map(),
      id: "x",
      isForward: false,
      isMeta: false,
      pos: focusActive.get()!,
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("first")).toHaveFocus();

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout: new Map(),
      id: "x",
      isForward: true,
      isMeta: false,
      pos: focusActive.get()!,
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("center")).toHaveFocus();

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout: new Map(),
      id: "x",
      isForward: true,
      isMeta: false,
      pos: { kind: "header-cell", colIndex: 1 },
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("last")).toHaveFocus();

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout: new Map(),
      id: "x",
      isForward: true,
      isMeta: false,
      pos: { kind: "header-cell", colIndex: 2 },
      scrollIntoView: vi.fn(),
      vp,
    });

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout: new Map(),
      id: "x",
      isForward: true,
      isMeta: false,
      pos: { kind: "header-cell", colIndex: 3 },
      scrollIntoView: vi.fn(),
      vp,
    });

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout: new Map(),
      id: "x",
      isForward: true,
      isMeta: false,
      pos: {
        kind: "header-group-cell",
        colIndex: 3,
        hierarchyRowIndex: 0,
        columnEndIndex: 2,
        columnStartIndex: 1,
      },
      scrollIntoView: vi.fn(),
      vp,
    });
  });

  test("should handle the case when there are is no header", () => {
    const s = render(
      <div data-testid="vp">
        <HeaderCellReact
          cell={{
            rowStart: 0,
            rowEnd: 1,
            colStart: 2,
            colEnd: 3,
            colPin: null,
            colSpan: 1,
          }}
          data-testid="last"
          columnId="x"
          isFloating={false}
          rtl={false}
          viewportWidth={1000}
          xPositions={new Uint32Array([0, 100, 200, 300, 400])}
        ></HeaderCellReact>
      </div>,
    );

    const store = createStore();
    const focusActive = makeGridAtom(
      atom<PositionUnion | null>({ colIndex: 0, kind: "header-cell" } satisfies PositionHeaderCell),
      store,
    );
    const vp = s.getByTestId("vp").element() as HTMLElement;
    (vp.firstElementChild as HTMLElement)?.focus();

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout: new Map(),
      id: "x",
      isForward: true,
      isMeta: false,
      pos: { kind: "header-cell", colIndex: 0 },
      scrollIntoView: vi.fn(),
      vp,
    });
  });

  test("should handle focusables in headers", async () => {
    const s = render(
      <div data-testid="vp">
        <HeaderReact
          floatingRowEnabled={false}
          floatingRowHeight={20}
          headerGroupHeight={20}
          headerHeight={20}
          rows={2}
          width={1000}
        >
          <HeaderRowReact headerRowIndex={0} maxRow={2}>
            <HeaderCellReact
              cell={{
                rowStart: 0,
                rowEnd: 2,
                colStart: 0,
                colEnd: 1,
                colPin: null,
                colSpan: 1,
              }}
              data-testid="second"
              columnId="x"
              isFloating={false}
              rtl={false}
              viewportWidth={1000}
              xPositions={new Uint32Array([0, 100, 200, 300, 400])}
            ></HeaderCellReact>

            <HeaderCellReact
              cell={{
                rowStart: 0,
                rowEnd: 2,
                colStart: 1,
                colEnd: 1,
                colPin: null,
                colSpan: 1,
              }}
              data-testid="second-2"
              columnId="x"
              isFloating={false}
              rtl={false}
              viewportWidth={1000}
              xPositions={new Uint32Array([0, 100, 200, 300, 400])}
            ></HeaderCellReact>
          </HeaderRowReact>

          <HeaderRowReact headerRowIndex={1} maxRow={2}>
            <HeaderCellReact
              cell={{
                rowStart: 0,
                rowEnd: 1,
                colStart: 0,
                colEnd: 1,
                colPin: null,
                colSpan: 1,
              }}
              data-testid="first"
              columnId="x"
              isFloating={false}
              rtl={false}
              viewportWidth={1000}
              xPositions={new Uint32Array([0, 100, 200, 300, 400])}
            ></HeaderCellReact>
          </HeaderRowReact>
        </HeaderReact>
      </div>,
    );

    const store = createStore();
    const focusActive = makeGridAtom(
      atom<PositionUnion | null>({ colIndex: 0, kind: "header-cell" } satisfies PositionHeaderCell),
      store,
    );
    const vp = s.getByTestId("vp").element() as HTMLElement;
    (s.getByTestId("first").element() as HTMLElement).focus();

    handleHorizontalArrow({
      columnCount: 3,
      focusActive,
      layout: new Map(),
      id: "x",
      isForward: true,
      isMeta: false,
      pos: { kind: "header-cell", colIndex: 0 },
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("second-2")).toHaveFocus();
  });
});
