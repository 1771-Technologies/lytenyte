import { useGridRoot } from "../context";

export function CellSpacePinStart({ xPositions: x }: { xPositions: Uint32Array }) {
  const ctx = useGridRoot().grid;
  const bounds = ctx.state.viewBounds.useValue();
  const offset = x[bounds.colCenterStart] - x[bounds.colStartEnd];

  const meta = ctx.state.columnMeta.useValue();
  if (meta.columnVisibleStartCount === 0) return null;

  return <div style={{ display: "inline-block", width: offset, height: 0 }} />;
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
  const ctx = useGridRoot().grid;
  const bounds = ctx.state.viewBounds.useValue();
  const offset = x[bounds.colCenterStart - bounds.colStartEnd];

  const meta = ctx.state.columnMeta.useValue();
  if (meta.columnVisibleStartCount > 0) return null;

  return <div style={{ display: "inline-block", width: offset, height: 0 }} />;
}
