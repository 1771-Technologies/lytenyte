import { useBounds } from "../root/bounds/context.js";
import { useGridRoot } from "../root/context.js";
import { useRowMeta } from "../rows/row/context.js";

export function CellSpacePinStart({ xPositions: x }: { xPositions: Uint32Array }) {
  const rowCtx = useRowMeta();
  const bounds = useBounds();

  const [start] = rowCtx.bounds;
  const colStartEnd = bounds.useValue((x) => x.colStartEnd);

  const { columnMeta: meta } = useGridRoot();
  if (meta.columnVisibleStartCount === 0) return null;

  const colOffset = rowCtx.layout.cells.findIndex(
    (c) => !c.colPin && c.colIndex + c.colSpan - 1 >= start && !c.isDeadCol,
  );
  const offset = x[colOffset] - x[colStartEnd];

  return (
    <div style={{ display: "inline-block", width: Number.isNaN(offset) ? 0 : offset, height: 0 }} />
  );
}

export function CellSpacerPinEnd() {
  const bounds = useBounds();
  const { vpInnerWidth, columnMeta, xPositions: x } = useGridRoot();

  const colCenterEnd = bounds.useValue((x) => x.colCenterEnd);
  const colEndStart = bounds.useValue((x) => x.colEndStart);

  const startOffset = x[colCenterEnd];
  let offset = x[colEndStart] - startOffset;

  if (x.at(-1)! < vpInnerWidth) {
    offset = vpInnerWidth - x.at(-1)!;
  }

  if (columnMeta.columnVisibleEndCount === 0) return null;

  return <div style={{ display: "inline-block", width: offset, height: 0 }} />;
}

export function CellSpacerNoPin() {
  const { layout, bounds: colBounds } = useRowMeta();
  const { xPositions: x, columnMeta } = useGridRoot();
  const bounds = useBounds();
  const colStartEnd = bounds.useValue((x) => x.colStartEnd);

  if (columnMeta.columnVisibleStartCount > 0) return null;

  const colOffset = layout.cells.findIndex(
    (c) => c.colIndex + c.colSpan - 1 >= colBounds[0] && !c.isDeadCol,
  );
  const offset = x[colOffset - colStartEnd];

  return <div style={{ display: "inline-block", width: offset, height: 0 }} />;
}
