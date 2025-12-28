import { useGridRoot } from "../context.js";
import { useRowMeta } from "../rows/row/context.js";

export function CellSpacePinStart({ xPositions: x }: { xPositions: Uint32Array }) {
  const { layout, colBounds } = useRowMeta();

  const ctx = useGridRoot().grid;
  const bounds = ctx.state.viewBounds.useValue();

  const meta = ctx.state.columnMeta.useValue();
  if (meta.columnVisibleStartCount === 0 || layout.kind === "full-width") return null;

  const colOffset = layout.cells.findIndex(
    (c) => !c.colPin && c.colIndex + c.colSpan - 1 >= colBounds[0] && !c.isDeadCol,
  );
  const offset = x[colOffset] - x[bounds.colStartEnd];

  return <div style={{ display: "inline-block", width: Number.isNaN(offset) ? 0 : offset, height: 0 }} />;
}

export function CellSpacerPinEnd({ xPositions: x }: { xPositions: Uint32Array }) {
  const ctx = useGridRoot().grid;
  const bounds = ctx.state.viewBounds.useValue();

  const startOffset = x[bounds.colCenterEnd];
  let offset = x[bounds.colEndStart] - startOffset;

  const viewWidth = ctx.state.viewportWidthInner.useValue();
  if (x.at(-1)! < viewWidth) {
    offset = viewWidth - x.at(-1)!;
  }

  const meta = ctx.state.columnMeta.useValue();
  if (meta.columnVisibleEndCount === 0) return null;

  return <div style={{ display: "inline-block", width: offset, height: 0 }} />;
}

export function CellSpacerNoPin({ xPositions: x }: { xPositions: Uint32Array }) {
  const { layout, colBounds } = useRowMeta();
  const ctx = useGridRoot().grid;
  const bounds = ctx.state.viewBounds.useValue();

  const meta = ctx.state.columnMeta.useValue();
  if (meta.columnVisibleStartCount > 0 || layout.kind === "full-width") return null;

  const colOffset = layout.cells.findIndex((c) => c.colIndex + c.colSpan - 1 >= colBounds[0] && !c.isDeadCol);
  const offset = x[colOffset - bounds.colStartEnd];

  return <div style={{ display: "inline-block", width: offset, height: 0 }} />;
}
