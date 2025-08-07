import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { RowsCenterReact } from "../../../renderer-react/rows-sections.js";
import { RowReact } from "../../../renderer-react/row.js";
import { CellReact } from "../../../renderer-react/cell.js";
import { atom, createStore } from "@1771technologies/atom";
import { makeGridAtom } from "../../../grid-atom/make-grid-atom";
import type { PositionGridCell, PositionUnion } from "../../../+types.js";
import type { LayoutMap } from "../../../+types.non-gen.js";
import { handleVerticalArrow } from "../handle-vertical-arrow.js";
import { HeaderReact } from "../../../renderer-react/header.js";
import { HeaderRowReact } from "../../../renderer-react/header-row.js";
import { HeaderGroupCellReact } from "../../../renderer-react/header-group-cell.js";
import { HeaderCellReact } from "../../../renderer-react/header-cell.js";
import { FULL_WIDTH_MAP } from "../../../+constants.js";
import { locators } from "@vitest/browser/context";

describe("handleVerticalArrow", () => {
  test("should correctly focus cells", async () => {
    const s = render(
      <div data-testid="vp">
        <HeaderReact
          floatingRowEnabled={false}
          floatingRowHeight={20}
          headerGroupHeight={20}
          headerHeight={20}
          rows={2}
          width={1000}
          data-testid="root"
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
              data-testid="up-one"
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
              data-testid="header-1"
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
              data-testid="header-2"
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
              data-testid="header-3"
              columnId="x"
              isFloating={false}
              rtl={false}
              viewportWidth={1000}
              xPositions={new Uint32Array([0, 100, 200, 300, 400])}
            ></HeaderCellReact>
          </HeaderRowReact>
        </HeaderReact>

        <RowsCenterReact height={100} rowFirst={0} rowLast={3} data-testid="center">
          <RowReact
            gridId="x"
            rowFirstPinBottom={false}
            rowIndex={0}
            rowIsFocusRow={false}
            rowLastPinTop={false}
            yPositions={new Uint32Array([0, 100, 200, 300])}
            accepted={[]}
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
          </RowReact>

          <RowReact
            gridId="x"
            rowFirstPinBottom={false}
            rowIndex={1}
            rowIsFocusRow={false}
            rowLastPinTop={false}
            yPositions={new Uint32Array([0, 100, 200, 300])}
            accepted={[]}
          >
            <CellReact
              cell={{
                colIndex: 0,
                colSpan: 1,
                rowIndex: 1,
                rowSpan: 1,
              }}
              data-testid="second"
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
          </RowReact>
        </RowsCenterReact>
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

    const map = new Map([[0, [0, 1]]]);
    const layoutMap: LayoutMap = new Map([
      [0, map],
      [1, map],
    ]) as LayoutMap;

    (s.getByTestId("first").element() as HTMLElement).focus();
    await expect.element(s.getByTestId("first")).toHaveFocus();

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: true,
      isMeta: false,
      layout: layoutMap,
      pos: focusActive.get()!,
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("second")).toHaveFocus();

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: false,
      isMeta: false,
      layout: layoutMap,
      pos: { kind: "cell", colIndex: 0, rowIndex: 1, root: null },
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("first")).toHaveFocus();

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: true,
      isMeta: true,
      layout: layoutMap,
      pos: focusActive.get()!,
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("second")).toHaveFocus();

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: false,
      isMeta: true,
      layout: layoutMap,
      pos: { kind: "cell", colIndex: 0, rowIndex: 1, root: null },
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("first")).toHaveFocus();

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: true,
      isMeta: true,
      layout: layoutMap,
      pos: {
        kind: "cell",
        colIndex: 0,
        rowIndex: 1,
        root: { colIndex: 0, rowIndex: 1, colSpan: 1, rowSpan: 1 },
      },
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("second")).toHaveFocus();

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: false,
      isMeta: true,
      layout: layoutMap,
      pos: {
        kind: "cell",
        colIndex: 0,
        rowIndex: 1,
        root: { colIndex: 0, rowIndex: 1, colSpan: 1, rowSpan: 1 },
      },
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("first")).toHaveFocus();

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: false,
      isMeta: false,
      layout: layoutMap,
      pos: focusActive.get()!,
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("header-1")).toHaveFocus();

    const header = s.getByTestId("root").element() as HTMLElement;
    header.removeAttribute("data-ln-header");
    header.childNodes.forEach((c) => {
      (c as HTMLElement).removeAttribute("data-ln-header-row");
    });

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: false,
      isMeta: false,
      layout: layoutMap,
      pos: { kind: "cell", colIndex: 0, rowIndex: 0, root: null },
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });

    header.setAttribute("data-ln-header", "true");
    header.childNodes.forEach((c) => {
      (c as HTMLElement).setAttribute("data-ln-header-row", "true");
    });

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: false,
      isMeta: false,
      layout: layoutMap,
      pos: { kind: "header-cell", colIndex: 0 },
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("up-one")).toHaveFocus();

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: true,
      isMeta: false,
      layout: layoutMap,
      pos: {
        kind: "header-group-cell",
        colIndex: 0,
        columnStartIndex: 0,
        columnEndIndex: 3,
        hierarchyRowIndex: 0,
      },
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("header-1")).toHaveFocus();

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: true,
      isMeta: false,
      layout: layoutMap,
      pos: {
        kind: "header-cell",
        colIndex: 0,
      },
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });

    await expect.element(s.getByTestId("first")).toHaveFocus();
  });

  test("should handle the lack of a header", () => {
    const vp = document.createElement("div");

    const store = createStore();
    const focusActive = makeGridAtom(atom<PositionUnion | null>(null), store);

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: true,
      isMeta: false,
      layout: new Map(),
      pos: { kind: "header-cell", colIndex: 0 },
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: false,
      isMeta: false,
      layout: new Map(),
      pos: { kind: "header-cell", colIndex: 0 },
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });
  });

  test("should handle header matching", () => {
    const vp = document.createElement("div");

    const header = document.createElement("div");
    header.setAttribute("data-ln-header", "true");
    vp.appendChild(header);

    const headerRow1 = document.createElement("div");
    headerRow1.setAttribute("data-ln-header-row", "true");
    const button = document.createElement("button");
    headerRow1.appendChild(button);

    const headerRow2 = document.createElement("div");
    headerRow2.setAttribute("data-ln-header-row", "true");
    const headerRow3 = document.createElement("div");
    headerRow3.setAttribute("data-ln-header-row", "true");

    header.appendChild(headerRow1);
    header.appendChild(headerRow2);
    header.appendChild(headerRow3);

    const row = document.createElement("div");
    row.setAttribute("data-ln-row", "true");
    row.setAttribute("data-ln-rowtype", "full-width");

    document.body.appendChild(vp);

    const store = createStore();
    const focusActive = makeGridAtom(atom<PositionUnion | null>(null), store);

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: true,
      isMeta: false,
      layout: new Map(),
      pos: { kind: "header-cell", colIndex: 0 },
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });

    button.focus();
    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: false,
      isMeta: false,
      layout: new Map(),
      pos: { kind: "header-cell", colIndex: 0 },
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });
  });

  test("should handle header matches", async () => {
    const vp = document.createElement("div");

    const header = document.createElement("div");
    header.setAttribute("data-ln-header", "true");
    vp.appendChild(header);

    const headerRow1 = document.createElement("div");
    headerRow1.setAttribute("data-ln-header-row", "true");
    const button = document.createElement("button");
    headerRow1.appendChild(button);
    const cell = document.createElement("div");
    cell.setAttribute("data-ln-header-group", "true");
    cell.setAttribute("data-ln-header-range", "0,5");
    headerRow1.appendChild(cell);

    const headerRow2 = document.createElement("div");
    headerRow2.setAttribute("data-ln-header-row", "true");

    const headerRow3 = document.createElement("div");
    headerRow3.setAttribute("data-ln-header-row", "true");

    const button2 = document.createElement("button");
    headerRow3.appendChild(button2);

    header.appendChild(headerRow1);
    header.appendChild(headerRow2);
    header.appendChild(headerRow3);

    const row = document.createElement("div");
    row.setAttribute("data-ln-row", "true");
    row.setAttribute("data-ln-rowtype", "full-width");

    const cell3 = document.createElement("div");
    cell.setAttribute("data-testid", "cell3");
    cell.tabIndex = 0;
    cell.setAttribute("data-ln-header-cell", "true");
    cell.setAttribute("data-ln-header-range", "0,1");
    headerRow3.appendChild(cell3);

    document.body.appendChild(vp);

    const store = createStore();
    const focusActive = makeGridAtom(atom<PositionUnion | null>(null), store);

    button2.focus();

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: false,
      isMeta: false,
      layout: new Map(),
      pos: { kind: "header-cell", colIndex: 0 },
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: true,
      isMeta: false,
      layout: new Map(),
      pos: { kind: "header-cell", colIndex: 0 },
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });

    cell3.focus();
    await expect.element(locators.createElementLocators(vp).getByTestId("cell3")).toHaveFocus();

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: true,
      isMeta: false,
      layout: new Map([[0, FULL_WIDTH_MAP]]),
      pos: { kind: "header-cell", colIndex: 0 },
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });

    const fullRow = document.createElement("div");
    fullRow.setAttribute("data-ln-row", "true");
    fullRow.setAttribute("data-ln-rowindex", "0");
    fullRow.setAttribute("data-ln-gridid", "x");
    fullRow.setAttribute("data-ln-rowtype", "full-width");
    vp.appendChild(fullRow);

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: true,
      isMeta: false,
      layout: new Map([[0, FULL_WIDTH_MAP]]),
      pos: { kind: "header-cell", colIndex: 0 },
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });

    fullRow.remove();

    handleVerticalArrow({
      focusActive,
      id: "x",
      isDown: true,
      isMeta: false,
      layout: new Map([[0, new Map([[0, [0, 1]]])]]),
      pos: { kind: "header-cell", colIndex: 0 },
      rowCount: 2,
      scrollIntoView: vi.fn(),
      vp,
    });
  });
});
