import { describe, expect, test } from "vitest";
import { createRowLayout } from "./create-row-layout.js";
import type { ColumnAbstract, RowNode } from "../types.js";

function cols(n: number): ColumnAbstract[] {
  return Array.from({ length: n }, (_, i) => ({ id: `c${i}` }));
}

function row(id: string): RowNode<any> {
  return { id, kind: "leaf", depth: 0, data: {} };
}

function makeLayout(opts: {
  rows: (RowNode<any> | null | undefined)[];
  columns?: ColumnAbstract[];
  computeColSpan?: ((r: number, c: number) => number) | null;
  computeRowSpan?: ((r: number, c: number) => number) | null;
  isFullWidth?: ((r: number) => boolean) | null;
  isCutoff?: (r: number) => boolean;
  startCutoff?: number;
  endCutoff?: number;
  topCutoff?: number;
  bottomCutoff?: number;
  rowLookback?: number;
  hasSpans?: boolean;
}) {
  const columns = opts.columns ?? cols(4);
  return createRowLayout({
    rowByIndex: (i) => opts.rows[i] ?? null,
    computeColSpan: opts.computeColSpan ?? null,
    computeRowSpan: opts.computeRowSpan ?? null,
    isFullWidth: opts.isFullWidth ?? null,
    isCutoff: opts.isCutoff ?? (() => false),
    columns,
    startCutoff: opts.startCutoff ?? 0,
    endCutoff: opts.endCutoff ?? columns.length,
    topCutoff: opts.topCutoff ?? 0,
    bottomCutoff: opts.bottomCutoff ?? Infinity,
    rowLookback: opts.rowLookback ?? 10,
    hasSpans: opts.hasSpans ?? false,
  });
}

/** Asserts the row is a row-with-cells and returns its cells array. */
function getCells(layout: ReturnType<typeof makeLayout>, index: number) {
  const r = layout.layoutByIndex(index);
  if (!r || r.kind !== "row") throw new Error(`Expected row-with-cells at index ${index}, got ${r?.kind}`);
  return r.cells;
}

describe("createRowLayout", () => {
  test("Should return correct root cells for a simple row with no spans", () => {
    // 4 columns × 1 row, no spans
    //
    //      c0    c1    c2    c3
    // r0 [ R  ][ R  ][ R  ][ R  ]
    //
    // R = root cell (isDeadCol=false, isDeadRow=false, root=null)

    const layout = makeLayout({ rows: [row("r0")] });
    const r = layout.layoutByIndex(0);

    expect(r).toMatchObject({ kind: "row", id: "r0", rowIndex: 0, rowPin: null });

    const c = getCells(layout, 0);
    for (let i = 0; i < 4; i++) {
      expect(c[i]).toMatchObject({
        kind: "cell",
        rowIndex: 0,
        colIndex: i,
        colSpan: 1,
        rowSpan: 1,
        isDeadCol: false,
        isDeadRow: false,
        root: null,
        colPin: null,
        rowPin: null,
      });
    }
  });

  test("Should return null when the row does not exist", () => {
    const layout = makeLayout({ rows: [] });

    expect(layout.layoutByIndex(0)).toBeNull();
    expect(layout.layoutByIndex(99)).toBeNull();
  });

  test("Should return a full-width row when isFullWidth returns true", () => {
    // 4 columns × 1 row — row 0 is full-width (no cells, spans all columns)
    //
    // r0 [       full-width       ]

    const layout = makeLayout({
      rows: [row("r0")],
      isFullWidth: (r) => r === 0,
    });
    const r = layout.layoutByIndex(0);

    expect(r).toMatchObject({ kind: "full-width", id: "r0", rowIndex: 0 });
    expect(r).not.toHaveProperty("cells");
  });

  test("Should mark adjacent cells as dead-col for a column span", () => {
    // 4 columns × 1 row. (r0, c0) has colSpan=2.
    //
    //      c0        c1    c2    c3
    // r0 [ R(cs=2) ][ Dc ][ R  ][ R  ]
    //
    // Dc = dead col (colSpan overflow from c0)

    const layout = makeLayout({
      rows: [row("r0")],
      computeColSpan: (r, c) => (r === 0 && c === 0 ? 2 : 1),
      hasSpans: true,
    });
    const c = getCells(layout, 0);

    expect(c[0]).toMatchObject({
      colIndex: 0,
      colSpan: 2,
      rowSpan: 1,
      isDeadCol: false,
      isDeadRow: false,
      root: null,
    });
    expect(c[1]).toMatchObject({ colIndex: 1, colSpan: 1, rowSpan: 1, isDeadCol: true, isDeadRow: false });
    expect(c[1].root).toBe(c[0]);
    expect(c[2]).toMatchObject({ colIndex: 2, isDeadCol: false, isDeadRow: false, root: null });
    expect(c[3]).toMatchObject({ colIndex: 3, isDeadCol: false, isDeadRow: false, root: null });
  });

  test("Should clamp a column span at a pin section boundary", () => {
    // 4 columns: c0, c1 are start-pinned (startCutoff=2); c2, c3 are scrollable.
    // (r0, c0) requests colSpan=4 — clamped to 2 (cannot cross into the scrollable section).
    // (r0, c2) requests colSpan=4 — clamped to 2 (cannot cross beyond the scrollable section).
    //
    //  <- start-pinned ->  <-  scrollable ->
    //      c0         c1    c2        c3
    // r0 [ R(4->2) ][ Dc ][ R(4->2) ][ Dc ]

    const layout = makeLayout({
      rows: [row("r0")],
      columns: cols(4),
      startCutoff: 2,
      computeColSpan: () => 4,
      hasSpans: true,
    });
    const c = getCells(layout, 0);

    expect(c[0]).toMatchObject({ colSpan: 2, isDeadCol: false });
    expect(c[1]).toMatchObject({ isDeadCol: true, isDeadRow: false });
    expect(c[1].root).toBe(c[0]);
    expect(c[2]).toMatchObject({ colSpan: 2, isDeadCol: false, root: null });
    expect(c[3]).toMatchObject({ isDeadCol: true, isDeadRow: false });
    expect(c[3].root).toBe(c[2]);
  });

  test("Should mark cells in subsequent rows as dead-row for a row span", () => {
    // 4 columns × 2 rows. (r0, c0) has rowSpan=2.
    //
    //      c0        c1    c2    c3
    // r0 [ R(rs=2) ][ R  ][ R  ][ R  ]
    // r1 [ Dr      ][ R  ][ R  ][ R  ]
    //
    // Dr = dead row (r0's c0 spans into r1)

    const layout = makeLayout({
      rows: [row("r0"), row("r1")],
      computeRowSpan: (r, c) => (r === 0 && c === 0 ? 2 : 1),
      hasSpans: true,
    });

    const r0 = getCells(layout, 0);
    const r1 = getCells(layout, 1);

    expect(r0[0]).toMatchObject({ rowIndex: 0, colIndex: 0, rowSpan: 2, isDeadRow: false, isDeadCol: false });
    expect(r1[0]).toMatchObject({ colIndex: 0, isDeadRow: true, isDeadCol: false });
    expect(r1[0].root).toBe(r0[0]);
    expect(r1[1]).toMatchObject({ colIndex: 1, isDeadRow: false, isDeadCol: false, root: null });
  });

  test("Should set rowIndex on dead-row cells to the root's row index", () => {
    // 4 columns × 2 rows. (r0, c0) has rowSpan=2.
    // The dead cell in r1 belongs to the root at r0, so its rowIndex must be 0.
    //
    //      c0        c1    c2    c3
    // r0 [ R(rs=2) ][ R  ][ R  ][ R  ]
    // r1 [ Dr      ][ R  ][ R  ][ R  ]
    //         ↑ rowIndex = 0 (not 1)

    const layout = makeLayout({
      rows: [row("r0"), row("r1")],
      computeRowSpan: (r, c) => (r === 0 && c === 0 ? 2 : 1),
      hasSpans: true,
    });

    const r1 = getCells(layout, 1);
    expect(r1[0].rowIndex).toBe(0);
    expect(r1[0].root).toBe(getCells(layout, 0)[0]);
  });

  test("Should clamp a row span at a pin section boundary", () => {
    // topCutoff=2: rows 0, 1 are top-pinned; rows 2+ are scrollable.
    // (r0, c0) requests rowSpan=5 — clamped to 2 (cannot span beyond topCutoff).
    //
    //  <- top-pinned->
    //      c0          c1    c2    c3
    // r0 [ R(5->2)    ][ R  ][ R  ][ R  ]
    // r1 [ Dr        ][ R  ][ R  ][ R  ]
    //  <- scrollable->
    // r2 [ R         ][ R  ][ R  ][ R  ]  <- NOT dead, span was clamped at topCutoff

    const layout = makeLayout({
      rows: [row("r0"), row("r1"), row("r2")],
      topCutoff: 2,
      computeRowSpan: (r, c) => (r === 0 && c === 0 ? 5 : 1),
      hasSpans: true,
    });

    expect(getCells(layout, 0)[0]).toMatchObject({ rowSpan: 2 });
    expect(getCells(layout, 1)[0]).toMatchObject({ isDeadRow: true });
    expect(getCells(layout, 2)[0]).toMatchObject({ isDeadRow: false, isDeadCol: false, root: null });
  });

  test("Should correctly set isDeadCol and isDeadRow flags for a combined col+row span", () => {
    // 4 columns × 2 rows. (r0, c0) has colSpan=2, rowSpan=2.
    //
    //      c0            c1      c2    c3
    // r0 [ R(cs=2,rs=2) ][ Dc  ][ R  ][ R  ]
    // r1 [ Dr           ][ Drc ][ R  ][ R  ]
    //
    // Dc  = isDeadCol only   (same row as root, non-root column)
    // Dr  = isDeadRow only   (different row, same column as root)
    // Drc = isDeadRow + isDeadCol (different row, non-root column)

    const layout = makeLayout({
      rows: [row("r0"), row("r1")],
      computeColSpan: (r, c) => (r === 0 && c === 0 ? 2 : 1),
      computeRowSpan: (r, c) => (r === 0 && c === 0 ? 2 : 1),
      hasSpans: true,
    });

    const r0 = getCells(layout, 0);
    const r1 = getCells(layout, 1);
    const root = r0[0];

    expect(root).toMatchObject({ colIndex: 0, isDeadCol: false, isDeadRow: false, root: null });
    expect(r0[1]).toMatchObject({ colIndex: 1, isDeadCol: true, isDeadRow: false, root });
    expect(r1[0]).toMatchObject({ colIndex: 0, isDeadCol: false, isDeadRow: true, root });
    expect(r1[1]).toMatchObject({ colIndex: 1, isDeadCol: true, isDeadRow: true, root });
  });

  test("Should set colFirstEndPin only on the first end-pinned column", () => {
    // 4 columns: c0, c1 scrollable; c2, c3 end-pinned (endCutoff=2).
    // Only c2 (index === endCutoff) gets colFirstEndPin=true.
    //
    //  <- scrollable ->  <- end-pinned->
    //      c0    c1    c2    c3
    // r0 [ R  ][ R  ][ R  ][ R  ]
    //               ↑ colFirstEndPin=true

    const layout = makeLayout({ rows: [row("r0")], endCutoff: 2 });
    const c = getCells(layout, 0);

    expect(c[0].colFirstEndPin).toBe(false);
    expect(c[1].colFirstEndPin).toBe(false);
    expect(c[2].colFirstEndPin).toBe(true);
    expect(c[3].colFirstEndPin).toBe(false);
  });

  test("Should set colLastStartPin only on the last start-pinned column", () => {
    // 4 columns: c0, c1 start-pinned (startCutoff=2); c2, c3 scrollable.
    // Only c1 (startCutoff - 1 = 1) gets colLastStartPin=true.
    //
    //  <- start-pinned ->  <- scrollable->
    //      c0    c1    c2    c3
    // r0 [ R  ][ R  ][ R  ][ R  ]
    //         ↑ colLastStartPin=true

    const layout = makeLayout({ rows: [row("r0")], startCutoff: 2 });
    const c = getCells(layout, 0);

    expect(c[0].colLastStartPin).toBe(false);
    expect(c[1].colLastStartPin).toBe(true);
    expect(c[2].colLastStartPin).toBe(false);
    expect(c[3].colLastStartPin).toBe(false);
  });

  test("Should set rowLastPinTop only on the last top-pinned row", () => {
    // topCutoff=2: rows 0, 1 are top-pinned; rows 2+ are scrollable.
    // Only row 1 (topCutoff - 1 = 1) gets rowLastPinTop=true.
    //
    //  r0 [ R  ] ...  top-pinned
    //  r1 [ R  ] ...  top-pinned  <- rowLastPinTop=true
    //  r2 [ R  ] ...  scrollable

    const layout = makeLayout({
      rows: [row("r0"), row("r1"), row("r2")],
      topCutoff: 2,
    });

    expect(getCells(layout, 0)[0].rowLastPinTop).toBe(false);
    expect(getCells(layout, 1)[0].rowLastPinTop).toBe(true);
    expect(getCells(layout, 2)[0].rowLastPinTop).toBe(false);
  });

  test("Should set rowFirstPinBottom only on the first bottom-pinned row", () => {
    // bottomCutoff=2: rows 2+ are bottom-pinned.
    // Only row 2 (index === bottomCutoff) gets rowFirstPinBottom=true.
    //
    //  r0 [ R  ] ...  scrollable
    //  r1 [ R  ] ...  scrollable
    //  r2 [ R  ] ...  bottom-pinned  <- rowFirstPinBottom=true
    //  r3 [ R  ] ...  bottom-pinned

    const layout = makeLayout({
      rows: [row("r0"), row("r1"), row("r2"), row("r3")],
      bottomCutoff: 2,
    });

    expect(getCells(layout, 0)[0].rowFirstPinBottom).toBe(false);
    expect(getCells(layout, 1)[0].rowFirstPinBottom).toBe(false);
    expect(getCells(layout, 2)[0].rowFirstPinBottom).toBe(true);
    expect(getCells(layout, 3)[0].rowFirstPinBottom).toBe(false);
  });

  test("Should return the same row object on repeated calls (cache hit)", () => {
    const layout = makeLayout({ rows: [row("r0")] });

    const first = layout.layoutByIndex(0);
    const second = layout.layoutByIndex(0);

    expect(first).toBe(second);
  });

  test("Should recompute rows after clearCache is called", () => {
    const layout = makeLayout({ rows: [row("r0")] });

    const before = layout.layoutByIndex(0);
    layout.clearCache();
    const after = layout.layoutByIndex(0);

    expect(after).not.toBe(before);
    expect(after).toMatchObject({ kind: "row", id: "r0", rowIndex: 0 });
  });

  test("Should return the same layout for layoutById and layoutByIndex", () => {
    const layout = makeLayout({ rows: [row("r0")] });

    const byIndex = layout.layoutByIndex(0);
    const byId = layout.layoutById("r0");

    expect(byIndex).toBe(byId);
  });

  test("Should return the cell itself when rootCell is called on a root cell", () => {
    const layout = makeLayout({ rows: [row("r0")] });
    const c = getCells(layout, 0);

    expect(layout.rootCell(0, 0)).toBe(c[0]);
  });

  test("Should return the root when rootCell is called on a dead cell", () => {
    // (r0, c0) has colSpan=2. c1 is a dead-col cell.
    // rootCell(0, 1) must return the root at (0, 0).
    //
    //      c0        c1    c2    c3
    // r0 [ R(cs=2) ][ Dc ][ R  ][ R  ]
    //               ↑ rootCell(0,1) -> c0

    const layout = makeLayout({
      rows: [row("r0")],
      computeColSpan: (r, c) => (r === 0 && c === 0 ? 2 : 1),
      hasSpans: true,
    });
    const root = getCells(layout, 0)[0];

    expect(layout.rootCell(0, 1)).toBe(root);
  });

  test("Should return the full-width row when rootCell is called on a full-width row", () => {
    // r0 is full-width — rootCell returns the row itself regardless of column.

    const layout = makeLayout({
      rows: [row("r0")],
      isFullWidth: () => true,
    });
    const fullWidthRow = layout.layoutByIndex(0);

    expect(layout.rootCell(0, 0)).toBe(fullWidthRow);
    expect(layout.rootCell(0, 3)).toBe(fullWidthRow);
  });

  test("Should return null when rootCell is called for an unknown row", () => {
    const layout = makeLayout({ rows: [] });

    expect(layout.rootCell(99, 0)).toBeNull();
  });

  test("Should not detect row spans from previous rows when hasSpans is false", () => {
    // 4 columns × 2 rows. (r0, c0) has rowSpan=2.
    // With hasSpans=false the lookback loop is skipped entirely.
    // Computing r1 directly (without computing r0 first) must produce a fresh root at c0.
    //
    //      c0        c1    c2    c3
    // r0 [ R(rs=2) ][ R  ][ R  ][ R  ]
    // r1 [ R       ][ R  ][ R  ][ R  ]  <- NOT Dr — lookback disabled

    const layout = makeLayout({
      rows: [row("r0"), row("r1")],
      computeRowSpan: (r, c) => (r === 0 && c === 0 ? 2 : 1),
      hasSpans: false,
    });

    // Compute r1 directly — r0 has never been computed, so occupiedFlags are empty
    const r1 = getCells(layout, 1);
    expect(r1[0]).toMatchObject({ isDeadRow: false, isDeadCol: false, root: null });
  });

  test("Should propagate row span occupancy across separate computeRow calls", () => {
    // 4 columns × 2 rows. (r0, c0) has rowSpan=2.
    // Computing r0 first marks occupiedFlags for r1.
    // A subsequent call for r1 must pick up that occupancy and produce a dead-row cell.
    //
    //      c0        c1    c2    c3
    // r0 [ R(rs=2) ][ R  ][ R  ][ R  ]   <- computed first
    // r1 [ Dr      ][ R  ][ R  ][ R  ]   <- occupancy carried over from r0

    const layout = makeLayout({
      rows: [row("r0"), row("r1")],
      computeRowSpan: (r, c) => (r === 0 && c === 0 ? 2 : 1),
      hasSpans: true,
    });

    layout.layoutByIndex(0); // populates occupiedFlags[1]
    const r1 = getCells(layout, 1);

    expect(r1[0]).toMatchObject({ isDeadRow: true, isDeadCol: false });
    expect(r1[0].root).toBe(getCells(layout, 0)[0]);
  });

  test("Should not detect row spans beyond the rowLookback window", () => {
    // 4 columns × 3 rows. (r0, c0) has rowSpan=3.
    // rowLookback=1: when computing r2, the lookback only reaches r1 — r0 is out of range.
    // r0's span is never detected, so (r2, c0) is a fresh root.
    //
    //      c0         c1    c2    c3
    // r0 [ R(rs=3)  ][ R  ][ R  ][ R  ]
    // r1 [ Dr       ][ R  ][ R  ][ R  ]
    // r2 [ R        ][ R  ][ R  ][ R  ]  <- NOT Dr — r0 is beyond the lookback window

    const layout = makeLayout({
      rows: [row("r0"), row("r1"), row("r2")],
      computeRowSpan: (r, c) => (r === 0 && c === 0 ? 3 : 1),
      rowLookback: 1,
      hasSpans: true,
    });

    // Compute r2 directly — lookback reaches r1 (rowSpan=1 there), not r0
    const r2 = getCells(layout, 2);
    expect(r2[0]).toMatchObject({ isDeadRow: false, isDeadCol: false, root: null });
  });
});
