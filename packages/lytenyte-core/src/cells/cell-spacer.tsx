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
  const offset = xPos[bounds.colEndStart] - startOffset;

  const meta = ctx.state.columnMeta.useValue();
  console.log(startOffset, offset, xPos[bounds.colEndStart - 0]);
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
