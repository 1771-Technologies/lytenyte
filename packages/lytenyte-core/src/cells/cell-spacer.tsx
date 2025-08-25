import { useGridRoot } from "../context";

export function CellSpacePinStart() {
  const ctx = useGridRoot().grid;
  const xPos = ctx.state.xPositions.useValue();
  const bounds = ctx.state.viewBounds.useValue();
  const offset = xPos[bounds.colCenterStart] - xPos[bounds.colStartEnd];

  const meta = ctx.state.columnMeta.useValue();
  if (meta.columnVisibleStartCount === 0) return null;

  return <div style={{ display: "inline-block", width: offset, height: 0 }} />;
}

export function CellSpacerPinEnd() {
  const ctx = useGridRoot().grid;
  const xPos = ctx.state.xPositions.useValue();
  const bounds = ctx.state.viewBounds.useValue();

  const startOffset = xPos[bounds.colCenterEnd];
  let offset = xPos[bounds.colEndStart] - startOffset;

  const viewWidth = ctx.state.viewportWidthInner.useValue();
  if (xPos.at(-1)! < viewWidth) {
    offset = viewWidth - xPos.at(-1)!;
  }

  const meta = ctx.state.columnMeta.useValue();
  if (meta.columnVisibleEndCount === 0) return null;

  return <div style={{ display: "inline-block", width: offset, height: 0 }} />;
}

export function CellSpacerNoPin() {
  const ctx = useGridRoot().grid;
  const xPos = ctx.state.xPositions.useValue();
  const bounds = ctx.state.viewBounds.useValue();
  const offset = xPos[bounds.colCenterStart - bounds.colStartEnd];

  const meta = ctx.state.columnMeta.useValue();
  if (meta.columnVisibleStartCount > 0) return null;

  return <div style={{ display: "inline-block", width: offset, height: 0 }} />;
}
