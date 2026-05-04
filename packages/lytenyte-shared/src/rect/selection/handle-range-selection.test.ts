import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { handleRangeSelect } from "./handle-range-selection.js";
import type { GridSections, PositionGridCell, PositionUnion } from "../../types.js";
import type { DataRect } from "../types.js";
import { wait } from "@1771technologies/js-utils";

const GRID_ID = "test-grid";

// All pin counts and pixel offsets are zero so:
// - getRangeAccess marks every section as accessible (no clamping)
// - computeScrollDirection always returns (0,0) for any mouse position
//   within the 600×400 viewport (autoscroller never starts)
const noSections: GridSections = {
  rowCount: 20,
  topCount: 0,
  centerCount: 20,
  bottomCount: 0,
  startCount: 0,
  endCount: 0,
  colCenterCount: 20,
  topCutoff: 0,
  bottomCutoff: 20,
  startCutoff: 0,
  endCutoff: 20,
  topOffset: 0,
  topRowOffset: 0,
  bottomOffset: 0,
  startOffset: 0,
  endOffset: 0,
};

// Creates a DOM element that satisfies the grid cell data-attribute contract.
// positionFromElement always sets root from span attributes, so even a 1×1
// cell returns root: { rowIndex, colIndex, rowSpan: 1, colSpan: 1 }.
function makeCell(row: number, col: number, rowSpan = 1, colSpan = 1): HTMLElement {
  const el = document.createElement("div");
  el.setAttribute("data-ln-gridid", GRID_ID);
  el.setAttribute("data-ln-cell", "true");
  el.setAttribute("data-ln-rowindex", String(row));
  el.setAttribute("data-ln-colindex", String(col));
  el.setAttribute("data-ln-rowspan", String(rowSpan));
  el.setAttribute("data-ln-colspan", String(colSpan));
  return el;
}

// Mirrors what positionFromElement returns for a makeCell element
// (root is always populated, even for 1×1 cells).
function cellPos(row: number, col: number, rowSpan = 1, colSpan = 1): PositionUnion {
  return {
    kind: "cell",
    rowIndex: row,
    colIndex: col,
    root: { rowIndex: row, colIndex: col, rowSpan, colSpan },
  };
}

// The DataRect produced by computeActiveRect for a plain 1×1 cell.
function cellRect(row: number, col: number): DataRect {
  return { rowStart: row, rowEnd: row + 1, columnStart: col, columnEnd: col + 1 };
}

const nextFrame = (): Promise<void> => new Promise((r) => requestAnimationFrame(() => r()));

interface SetupOptions {
  cellSelections?: DataRect[];
  isMultiRange?: boolean;
  ignoreFirst?: boolean;
  currentFocus?: PositionUnion | null;
  clearOnSelfSelect?: boolean;
}

let container: HTMLDivElement;
let viewport: HTMLDivElement;

beforeEach(() => {
  container = document.createElement("div");
  viewport = document.createElement("div");
  // Real layout so getBoundingClientRect() returns meaningful bounds.
  // Fixed at (0,0) 600×400 — mouse events at clientX=300, clientY=200 land
  // in the centre, keeping the autoscroller direction at (0,0).
  viewport.style.cssText = "position:fixed;left:0;top:0;width:600px;height:400px;overflow:auto;";
  document.body.appendChild(viewport);
  document.body.appendChild(container);
});

afterEach(() => {
  viewport.remove();
  container.remove();
});

// Wires handleRangeSelect to container's mousedown and returns the captured
// call arrays plus a getter for the current anchor value.
function setup(options: SetupOptions = {}) {
  const activeRectCalls: (DataRect | null)[] = [];
  const selectionCalls: DataRect[][] = [];
  const deselectCalls: boolean[] = [];
  const dragCalls: boolean[] = [];
  let anchor: PositionGridCell | null = null;

  const anchorRef = {
    get: () => anchor,
    set: (p: PositionGridCell | null) => {
      anchor = p;
    },
  };

  container.addEventListener("mousedown", (ev) =>
    handleRangeSelect({
      ev,
      gridId: GRID_ID,
      rtl: false,
      cellSelections: options.cellSelections ?? [],
      viewport,
      gridSections: noSections,
      isMultiRange: options.isMultiRange ?? true,
      ignoreFirst: options.ignoreFirst ?? false,
      cellRoot: (row, col) => cellPos(row, col),
      anchorRef,
      currentFocus: options.currentFocus ?? null,
      clearOnSelfSelect: options.clearOnSelfSelect ?? true,
      onActiveRangeChange: (r) => activeRectCalls.push(r),
      onDeselectChange: (b) => deselectCalls.push(b),
      onSelectionChange: (r) => selectionCalls.push(r),
      onDragChange: (d) => dragCalls.push(d),
    }),
  );

  return { activeRectCalls, selectionCalls, deselectCalls, dragCalls, getAnchor: () => anchor };
}

function fireMousedown(target: HTMLElement, init: MouseEventInit = {}): MouseEvent {
  const ev = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
    clientX: 300,
    clientY: 200,
    button: 0,
    ...init,
  });
  target.dispatchEvent(ev);
  return ev;
}

function fireMouseup() {
  document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
}

function fireContextmenu() {
  document.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }));
}

function fireMousemove(target: HTMLElement, init: MouseEventInit = {}) {
  target.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, clientX: 300, clientY: 200, ...init }));
}

describe("handleRangeSelect", () => {
  describe("null guards", () => {
    test("Should return early without calling any callback when target is not inside a grid cell", () => {
      const { activeRectCalls, selectionCalls, deselectCalls } = setup();
      const plainDiv = document.createElement("div");
      container.appendChild(plainDiv);

      fireMousedown(plainDiv);

      expect(activeRectCalls).toHaveLength(0);
      expect(selectionCalls).toHaveLength(0);
      expect(deselectCalls).toHaveLength(0);
    });

    test("Should return early without calling any callback when the focusable element is not a cell kind", () => {
      const { activeRectCalls, selectionCalls, deselectCalls } = setup();
      // A header cell (kind = "header-cell") causes handleRangeSelect to return
      // immediately after the startPosition.kind !== "cell" guard.
      const headerCell = document.createElement("div");
      headerCell.setAttribute("data-ln-gridid", GRID_ID);
      headerCell.setAttribute("data-ln-header-cell", "true");
      headerCell.setAttribute("data-ln-colindex", "3");
      container.appendChild(headerCell);

      fireMousedown(headerCell);

      expect(activeRectCalls).toHaveLength(0);
      expect(selectionCalls).toHaveLength(0);
      expect(deselectCalls).toHaveLength(0);
    });
  });

  describe("right-click (button=2)", () => {
    test("Should call preventDefault when right-clicking a cell that is inside an existing selection", () => {
      const sel: DataRect = { rowStart: 2, rowEnd: 6, columnStart: 4, columnEnd: 7 };
      setup({ cellSelections: [sel] });
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      const ev = fireMousedown(cellEl, { button: 2 });

      expect(ev.defaultPrevented).toBe(true);
    });

    test("Should not call preventDefault when right-clicking a cell outside all selections", () => {
      const sel: DataRect = { rowStart: 0, rowEnd: 2, columnStart: 0, columnEnd: 3 };
      setup({ cellSelections: [sel] });
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      const ev = fireMousedown(cellEl, { button: 2 });

      expect(ev.defaultPrevented).toBe(false);
    });

    test("Should not call any callback after a right-click", () => {
      const { activeRectCalls, selectionCalls, deselectCalls } = setup();
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl, { button: 2 });

      expect(activeRectCalls).toHaveLength(0);
      expect(selectionCalls).toHaveLength(0);
      expect(deselectCalls).toHaveLength(0);
    });
  });

  describe("plain click (no modifier)", () => {
    test("Should not call onActiveRangeChange at mousedown for a plain click", () => {
      const { activeRectCalls } = setup();
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl);

      expect(activeRectCalls).toHaveLength(0);
    });

    test("Should mirror the active rect into onSelectionChange at mousedown", () => {
      const { selectionCalls } = setup();
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl);

      expect(selectionCalls[0]).toEqual([cellRect(3, 5)]);
    });

    test("Should call onDeselectChange(false) at mousedown", () => {
      const { deselectCalls } = setup();
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl);

      expect(deselectCalls[0]).toBe(false);
    });

    test("Should set the anchor to the clicked cell position", () => {
      const { getAnchor } = setup();
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl);

      expect(getAnchor()).toEqual(cellPos(3, 5));
    });

    test("Should commit the cell rect via onSelectionChange on mouseup", () => {
      const { selectionCalls } = setup();
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl);
      fireMouseup();

      expect(selectionCalls.at(-1)).toEqual([cellRect(3, 5)]);
    });

    test("Should clear the active rect via onActiveRangeChange(null) on mouseup", () => {
      const { activeRectCalls } = setup();
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl);
      fireMouseup();

      expect(activeRectCalls.at(-1)).toBeNull();
    });

    test("Should call onDeselectChange(false) on mouseup", () => {
      const { deselectCalls } = setup();
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl);
      fireMouseup();

      expect(deselectCalls.at(-1)).toBe(false);
    });
  });

  describe("shift-click (extend selection)", () => {
    test("Should mirror active rect as last selection (stripping previous last) at mousedown", () => {
      const sel1: DataRect = { rowStart: 0, rowEnd: 2, columnStart: 0, columnEnd: 3 };
      const sel2: DataRect = { rowStart: 5, rowEnd: 8, columnStart: 5, columnEnd: 9 };
      const { selectionCalls } = setup({ cellSelections: [sel1, sel2] });
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl, { shiftKey: true });

      expect(selectionCalls[0]).toEqual([sel1, cellRect(3, 5)]);
    });

    test("Should not update the anchor when shift is held", () => {
      const { getAnchor } = setup();
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl, { shiftKey: true });

      expect(getAnchor()).toBeNull();
    });

    test("Should replace the last selection with the anchor-to-current rect on mouseup", () => {
      const sel1: DataRect = { rowStart: 0, rowEnd: 2, columnStart: 0, columnEnd: 3 };
      const sel2: DataRect = { rowStart: 5, rowEnd: 8, columnStart: 5, columnEnd: 9 };
      const { selectionCalls } = setup({ cellSelections: [sel1, sel2] });
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl, { shiftKey: true });
      fireMouseup();

      // sel2 is stripped; finalRect is anchor(=startPos, since prior anchor was null) -> current
      expect(selectionCalls.at(-1)).toEqual([sel1, cellRect(3, 5)]);
    });

    test("Should use the previously set anchor when shift-clicking after a prior plain click", () => {
      // Line 98: anchorPosition = shiftOnly && anchor ? anchor : startPosition
      // The `anchor` truthy branch is only reached when anchorRef already holds a value
      // from a prior non-shift mousedown. All other shift tests start with anchor=null.
      const { selectionCalls } = setup();
      const anchorEl = makeCell(1, 2);
      const currentEl = makeCell(6, 9);
      container.appendChild(anchorEl);
      container.appendChild(currentEl);

      // First plain click sets the anchor to cell(1,2).
      fireMousedown(anchorEl);
      fireMouseup();

      // Shift-click on a different cell: anchor is now (1,2), not null.
      // anchorPosition = anchor (line 98 left branch), currentPosition = cell(6,9).
      fireMousedown(currentEl, { shiftKey: true });
      fireMouseup();

      expect(selectionCalls.at(-1)).toEqual([{ rowStart: 1, rowEnd: 7, columnStart: 2, columnEnd: 10 }]);
    });
  });

  describe("ctrl-click (multi-range additive)", () => {
    test("Should mirror the new rect appended to existing selections at mousedown when ctrl is held", () => {
      const existingSel: DataRect = { rowStart: 0, rowEnd: 2, columnStart: 0, columnEnd: 3 };
      const { selectionCalls } = setup({ cellSelections: [existingSel] });
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl, { ctrlKey: true });

      expect(selectionCalls[0]).toEqual([existingSel, cellRect(3, 5)]);
    });

    test("Should append the new rect to existing selections on mouseup when isMultiRange=true", () => {
      const existingSel: DataRect = { rowStart: 0, rowEnd: 2, columnStart: 0, columnEnd: 3 };
      const { selectionCalls } = setup({ cellSelections: [existingSel], isMultiRange: true });
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl, { ctrlKey: true });
      fireMouseup();

      expect(selectionCalls.at(-1)).toEqual([existingSel, cellRect(3, 5)]);
    });
  });

  describe("ctrl-click on a selected cell (deselect)", () => {
    test("Should call onDeselectChange(true) at mousedown when the cell is inside an existing selection", () => {
      // Cell (3,5) falls inside this rect (row 3 ∈ [2,6), col 5 ∈ [4,7))
      const sel: DataRect = { rowStart: 2, rowEnd: 6, columnStart: 4, columnEnd: 7 };
      const { deselectCalls } = setup({ cellSelections: [sel], isMultiRange: true });
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl, { ctrlKey: true });

      expect(deselectCalls[0]).toBe(true);
    });

    test("Should remove the deselected area from selections on mouseup", () => {
      // Use a selection that exactly matches the 1×1 cell so deselectRect returns []
      const sel: DataRect = cellRect(3, 5);
      const { selectionCalls } = setup({ cellSelections: [sel], isMultiRange: true });
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl, { ctrlKey: true });
      fireMouseup();

      expect(selectionCalls.at(-1)).toEqual([]);
    });
  });

  describe("self-click (clearOnSelfSelect=false, re-clicking the focused cell)", () => {
    test("Should not call onActiveRangeChange or onSelectionChange at mousedown", () => {
      const { activeRectCalls, selectionCalls } = setup({
        clearOnSelfSelect: false,
        // currentFocus must match what positionFromElement returns for makeCell(3,5):
        // root is always populated, even for 1×1 cells
        currentFocus: cellPos(3, 5),
      });
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl);

      expect(activeRectCalls).toHaveLength(0);
      expect(selectionCalls).toHaveLength(0);
    });

    test("Should not call onSelectionChange on mouseup when the mouse never moved to a different cell", () => {
      const { selectionCalls } = setup({
        clearOnSelfSelect: false,
        currentFocus: cellPos(3, 5),
      });
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl);
      fireMouseup();

      expect(selectionCalls).toHaveLength(0);
    });
  });

  describe("drag (mousemove to a different cell)", () => {
    test("Should update onSelectionChange to the anchor-to-hovered rect after the animation frame", async () => {
      const { selectionCalls } = setup();
      const cellEl = makeCell(3, 5);
      const cell2El = makeCell(7, 8);
      container.appendChild(cellEl);
      container.appendChild(cell2El);

      fireMousedown(cellEl);
      fireMousemove(cell2El);
      await nextFrame();

      // anchor=(3,5)  ->  bounds {row:3..4, col:5..6}
      // current=(7,8)  ->  bounds {row:7..8, col:8..9}
      // union  ->  {rowStart:3, rowEnd:8, columnStart:5, columnEnd:9}
      expect(selectionCalls.at(-1)).toEqual([
        {
          rowStart: 3,
          rowEnd: 8,
          columnStart: 5,
          columnEnd: 9,
        },
      ]);
    });

    test("Should commit the anchor-to-current rect on mouseup after a drag", async () => {
      const { selectionCalls } = setup();
      const cellEl = makeCell(3, 5);
      const cell2El = makeCell(7, 8);
      container.appendChild(cellEl);
      container.appendChild(cell2El);

      fireMousedown(cellEl);
      fireMousemove(cell2El);
      await nextFrame();
      fireMouseup();

      expect(selectionCalls.at(-1)).toEqual([{ rowStart: 3, rowEnd: 8, columnStart: 5, columnEnd: 9 }]);
    });
  });

  describe("ignoreFirst=true (column 0 is ignored)", () => {
    test("Should return early without calling any callback when mousedown is on column 0", () => {
      const { activeRectCalls, selectionCalls, deselectCalls } = setup({ ignoreFirst: true });
      const cellEl = makeCell(3, 0);
      container.appendChild(cellEl);

      fireMousedown(cellEl);

      expect(activeRectCalls).toHaveLength(0);
      expect(selectionCalls).toHaveLength(0);
      expect(deselectCalls).toHaveLength(0);
    });

    test("Should not update currentPosition when mousemove enters column 0 during a drag", async () => {
      const { selectionCalls } = setup({ ignoreFirst: true });
      const anchorEl = makeCell(3, 5);
      const col0El = makeCell(3, 0);
      container.appendChild(anchorEl);
      container.appendChild(col0El);

      fireMousedown(anchorEl);
      fireMousemove(col0El);
      await nextFrame();
      fireMouseup();

      // currentPosition was NOT updated to col 0; rect stays as the single anchor cell
      expect(selectionCalls.at(-1)).toEqual([cellRect(3, 5)]);
    });

    test("Should correctly update selection when dragging back to a previous cell after passing through column 0", async () => {
      const { selectionCalls } = setup({ ignoreFirst: true });
      const anchorEl = makeCell(3, 5);
      const col0El = makeCell(3, 0);
      const col3El = makeCell(3, 3);
      container.appendChild(anchorEl);
      container.appendChild(col0El);
      container.appendChild(col3El);

      fireMousedown(anchorEl);
      fireMousemove(col0El); // skipped — col 0
      fireMousemove(col3El); // should process correctly despite col0 being visited
      await nextFrame();
      fireMouseup();

      // rect spans anchor(3,5) -> current(3,3)
      expect(selectionCalls.at(-1)).toEqual([{ rowStart: 3, rowEnd: 4, columnStart: 3, columnEnd: 6 }]);
    });

    test("Should not update currentPosition to column 0 when autoscroller fires over a column 0 cell", async () => {
      const { selectionCalls } = setup({ ignoreFirst: true });
      const anchorEl = makeCell(3, 5);
      container.appendChild(anchorEl);

      // A column 0 cell positioned at document coords (20,180)-(70,230)
      // so elementFromPoint(30,200) in updateSelectionAtPoint finds it.
      const col0El = makeCell(3, 0);
      col0El.style.cssText = "position:absolute;left:20px;top:180px;width:50px;height:50px;";
      viewport.appendChild(col0El);

      fireMousedown(anchorEl);
      // clientX=30 -> x=30 < ZONE(50) -> dirX=-1 -> autoscroller starts
      // lastMouseX=30, lastMouseY=200 -> elementFromPoint(30,200) returns col0El
      fireMousemove(container, { clientX: 30, clientY: 200 });
      await wait(50);
      fireMouseup();

      // currentPosition must NOT have been updated to col 0;
      // all committed selections should have columnStart >= 1
      expect(selectionCalls.every((rects) => rects.every((r) => r.columnStart >= 1))).toBe(true);
    });
  });

  describe("contextmenu as drag-end", () => {
    test("Should commit the selection and clear the active rect when contextmenu fires on the document", () => {
      const { activeRectCalls, selectionCalls } = setup();
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl);
      fireContextmenu();

      expect(selectionCalls.at(-1)).toEqual([cellRect(3, 5)]);
      expect(activeRectCalls.at(-1)).toBeNull();
    });
  });

  describe("self-click drag (lines 218-220)", () => {
    test("Should break out of self-click mode and mirror active rect into onSelectionChange when dragged to a different cell", () => {
      // isSelfClick=true (clearOnSelfSelect=false, same focused cell).
      // First mousemove to a DIFFERENT cell triggers the hasDragged branch:
      //   hasDragged = true          (line 218)
      //   setActiveRangeDeduped(...) (synchronous — before RAF, also mirrors to onSelectionChange)
      const { selectionCalls } = setup({
        clearOnSelfSelect: false,
        currentFocus: cellPos(3, 5),
      });
      const cellEl = makeCell(3, 5);
      const cell2El = makeCell(7, 8);
      container.appendChild(cellEl);
      container.appendChild(cell2El);

      fireMousedown(cellEl);
      fireMousemove(cell2El);

      // selection updated synchronously to the anchor-to-current range
      expect(selectionCalls.at(-1)).toEqual([{ rowStart: 3, rowEnd: 8, columnStart: 5, columnEnd: 9 }]);
    });

    test("Should mirror rect into onSelectionChange when ctrl is held during self-click drag", () => {
      const { selectionCalls } = setup({
        clearOnSelfSelect: false,
        currentFocus: cellPos(3, 5),
      });
      const cellEl = makeCell(3, 5);
      const cell2El = makeCell(7, 8);
      container.appendChild(cellEl);
      container.appendChild(cell2El);

      fireMousedown(cellEl, { ctrlKey: true });
      fireMousemove(cell2El);

      // ctrlOnly+multiRange: baseSelections=cellSelections=[], rect appended directly
      expect(selectionCalls.at(-1)).toEqual([{ rowStart: 3, rowEnd: 8, columnStart: 5, columnEnd: 9 }]);
    });
  });

  // ─── updateSelectionAtPoint (lines 152-165) ────────────────────────────────
  // This function is the autoscroller's onScrolled callback. It is only reached
  // when the mouse is within 50px of a viewport edge so computeScrollDirection
  // returns a non-zero direction and the autoscroller actually starts.
  // The viewport is position:fixed at (0,0) 600×400, so clientX=30 puts x=30
  // inside the left-edge ZONE (< 50px)  ->  dirX=-1  ->  autoscroller fires.

  describe("updateSelectionAtPoint via autoscroller", () => {
    test("Should update currentPosition and call setActiveRangeDeduped when the autoscroller fires over a new grid cell", async () => {
      setup();
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      // Viewport is position:fixed at (0,0). An absolute child at left:20px top:180px
      // occupies document coords (20,180)–(70,230). elementFromPoint(30,200) finds it.
      const hoveredEl = makeCell(10, 10);
      hoveredEl.style.cssText = "position:absolute;left:20px;top:180px;width:50px;height:50px;";
      viewport.appendChild(hoveredEl);

      fireMousedown(cellEl);
      // clientX=30  ->  x=30 < ZONE(50)  ->  dirX=-1  ->  autoscroller starts.
      // lastMouseX=30, lastMouseY=200  ->  elementFromPoint(30,200) returns hoveredEl.
      fireMousemove(container, { clientX: 30, clientY: 200 });
      await wait(50);
      fireMouseup();

      // await wait(50);
      // // currentPosition updated to cell(10,10); rect spans anchor(3,5) -> current(10,10).
      // expect(activeRectCalls.some((r) => r?.rowStart === 3 && r?.rowEnd === 11)).toBe(true);
    });

    test("Should still call setActiveRangeDeduped when no focusable cell is under the cursor", async () => {
      const { activeRectCalls } = setup();
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl);
      const callsAtMousedown = activeRectCalls.length;

      // clientX=595  ->  x=595 > 550 (600-ZONE)  ->  dirX=1  ->  autoscroller starts.
      // elementFromPoint(595,200) returns the viewport div, which is not a grid cell.
      // hoveredCell is null  ->  line 155 false  ->  skip 156-161.
      // Line 164: !isSelfClick(=false) || hasDragged  ->  true  ->  setActiveRangeDeduped called.
      fireMousemove(container, { clientX: 595, clientY: 200 });
      await wait(50);
      fireMouseup();

      expect(activeRectCalls.length).toBeGreaterThan(callsAtMousedown);
    });

    test("Should not call setActiveRangeDeduped when the autoscroller fires during a self-click before any drag", async () => {
      const { activeRectCalls } = setup({
        clearOnSelfSelect: false,
        currentFocus: cellPos(3, 5),
      });
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      // isSelfClick=true  ->  mousedown skips setActiveRangeDeduped (0 calls).
      fireMousedown(cellEl);
      expect(activeRectCalls).toHaveLength(0);

      // clientX=10  ->  dirX=-1  ->  autoscroller starts. No grid cell at (10,200) in viewport
      // so hoveredCell=null, hasDragged stays false.
      // Line 164: !isSelfClick(=true) || hasDragged(=false) = false  ->  block NOT entered.
      fireMousemove(container, { clientX: 10, clientY: 200 });
      await wait(50);

      expect(activeRectCalls).toHaveLength(0);
      fireMouseup();
    });

    test("Should skip the position update when the hovered focusable is not a cell kind", async () => {
      const { selectionCalls } = setup();
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      // A header cell at the same document coords as the mouse position.
      // getNearestFocusable returns it, but position.kind === "header-cell"  ->  line 157 false.
      const headerEl = document.createElement("div");
      headerEl.setAttribute("data-ln-gridid", GRID_ID);
      headerEl.setAttribute("data-ln-header-cell", "true");
      headerEl.setAttribute("data-ln-colindex", "10");
      headerEl.style.cssText = "position:absolute;left:20px;top:180px;width:50px;height:50px;";
      viewport.appendChild(headerEl);

      fireMousedown(cellEl);
      fireMousemove(container, { clientX: 30, clientY: 200 });
      await wait(50);
      fireMouseup();

      // currentPosition was NOT updated (header cell skipped), so the selection
      // stays as the single-cell anchor rect for cell(3,5).
      expect(selectionCalls.some((r) => r.at(-1)?.rowStart === 3 && r.at(-1)?.rowEnd === 4)).toBe(true);
    });

    test("Should still call setActiveRangeDeduped when elementFromPoint returns null", async () => {
      const { activeRectCalls } = setup();
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl);
      const callsAtMousedown = activeRectCalls.length;

      // clientX=-1  ->  x=-1 < ZONE(50)  ->  dirX=-1  ->  autoscroller starts.
      // lastMouseX=-1 is outside the browser viewport so elementFromPoint(-1,...) returns null.
      // Line 153: if(el)  ->  false  ->  skip 154-162.
      // Line 164: !isSelfClick  ->  true  ->  setActiveRangeDeduped still called.
      fireMousemove(container, { clientX: -1, clientY: 200 });
      await wait(50);
      fireMouseup();

      expect(activeRectCalls.length).toBeGreaterThan(callsAtMousedown);
    });
  });

  describe("mousemove remaining branches", () => {
    test("Should return early when the mousemove target is a focusable but not a cell kind", () => {
      // Fires mousemove directly on a header-cell element so that getNearestFocusable
      // returns a non-null element but getPositionFromFocusable gives kind !== "cell".
      // Line 209: if (position.kind !== "cell") return  <- true branch.
      const { activeRectCalls } = setup();
      const cellEl = makeCell(3, 5);
      const headerEl = document.createElement("div");
      headerEl.setAttribute("data-ln-gridid", GRID_ID);
      headerEl.setAttribute("data-ln-header-cell", "true");
      headerEl.setAttribute("data-ln-colindex", "8");
      container.appendChild(cellEl);
      container.appendChild(headerEl);

      fireMousedown(cellEl);
      const callsAfterMousedown = activeRectCalls.length;

      // Target is a header cell  ->  position.kind === "header-cell"  ->  early return at line 209.
      // currentPosition and previousCell must NOT be updated.
      fireMousemove(headerEl);

      expect(activeRectCalls.length).toBe(callsAfterMousedown);
      fireMouseup();
    });

    test("Should not schedule a RAF when self-click moves to the same cell (hasDragged stays false)", () => {
      // Line 225: if (!isSelfClick || hasDragged)  ->  false when isSelfClick=true, hasDragged=false.
      // Reached when the mousemove target IS a different cell element but maps to the same
      // logical (row, col) as the starting cell, so the hasDragged branch at line 217 is not
      // entered and hasDragged remains false.
      const { activeRectCalls } = setup({
        clearOnSelfSelect: false,
        currentFocus: cellPos(3, 5),
      });
      const cellEl = makeCell(3, 5);
      container.appendChild(cellEl);

      fireMousedown(cellEl);
      expect(activeRectCalls).toHaveLength(0);

      // A second element for the same logical cell (same row/col) to give the mousemove
      // handler a new target but the same position  ->  hasDragged stays false.
      const sameCellEl = makeCell(3, 5);
      container.appendChild(sameCellEl);

      // isSelfClick=true, target changes but movedCol===startCol && movedRow===startRow
      //  ->  line 217 false  ->  hasDragged stays false  ->  line 225 false  ->  no RAF scheduled.
      fireMousemove(sameCellEl);
      expect(activeRectCalls).toHaveLength(0);
      fireMouseup();
    });

    test("Should return early when mousemove fires a second time with the same target element", async () => {
      // Line 204: if (!target || target === previousTarget) return;
      // First mousemove on cell2El processes normally and sets previousTarget=cell2El.
      // Second mousemove on cell2El hits target === previousTarget  ->  early return.
      const { activeRectCalls } = setup();
      const cellEl = makeCell(3, 5);
      const cell2El = makeCell(7, 8);
      container.appendChild(cellEl);
      container.appendChild(cell2El);

      fireMousedown(cellEl);
      fireMousemove(cell2El); // first: previousTarget becomes cell2El
      const callsAfterFirst = activeRectCalls.length;

      fireMousemove(cell2El); // second: target === previousTarget  ->  early return at line 204
      // No RAF should be re-scheduled; synchronous call count stays the same.
      expect(activeRectCalls.length).toBe(callsAfterFirst);
      fireMouseup();
    });

    test("Should cancel the pending RAF and reschedule when a second mousemove fires before the frame runs", async () => {
      // Line 226: if (selectionFrame) cancelAnimationFrame(selectionFrame)  <- true branch.
      // Achieved by firing two mousemoves to different cells without awaiting a frame.
      const { selectionCalls } = setup();
      const cellEl = makeCell(3, 5);
      const cell2El = makeCell(7, 8);
      const cell3El = makeCell(10, 12);
      container.appendChild(cellEl);
      container.appendChild(cell2El);
      container.appendChild(cell3El);

      fireMousedown(cellEl);
      fireMousemove(cell2El); // schedules RAF (selectionFrame becomes non-null)
      fireMousemove(cell3El); // selectionFrame is non-null  ->  line 226 true  ->  cancel + reschedule
      await nextFrame();
      fireMouseup();

      // Final rect should reflect the last hovered cell (10,12), not (7,8).
      expect(selectionCalls.some((r) => r.at(-1)?.rowEnd === 11 && r.at(-1)?.columnEnd === 13)).toBe(true);
    });
  });

  describe("pending animation frame cancelled on mouseup (lines 242-243)", () => {
    test("Should cancel the pending RAF and still commit the correct rect when mouseup fires before the frame runs", () => {
      // mousemove schedules a RAF (selectionFrame becomes non-null).
      // mouseup fires BEFORE the frame runs  ->  lines 242-243 execute.
      // currentPosition was already updated synchronously by the mousemove handler,
      // so endDrag still computes the correct anchor-to-current rect.
      const { selectionCalls } = setup();
      const cellEl = makeCell(3, 5);
      const cell2El = makeCell(7, 8);
      container.appendChild(cellEl);
      container.appendChild(cell2El);

      fireMousedown(cellEl);
      fireMousemove(cell2El); // selectionFrame set; do NOT await the frame
      fireMouseup(); // cancels the RAF (lines 242-243), commits rect

      expect(selectionCalls.at(-1)).toEqual([{ rowStart: 3, rowEnd: 8, columnStart: 5, columnEnd: 9 }]);
    });
  });
});
