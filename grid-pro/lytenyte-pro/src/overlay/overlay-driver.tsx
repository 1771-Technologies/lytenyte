import { LoadingOverlay } from "./loading-overlay";
import { NoDataOverlay } from "./no-data-overlay";
import { LoadErrorOverlay } from "./load-error-overlay";
import { useGrid } from "../use-grid";

export function OverlayDriver() {
  const { state, api } = useGrid();

  const headerHeight = state.internal.viewportHeaderHeight.use();
  const overlayId = state.overlayToShow.use();
  const overlays = state.overlays.use();

  const width = state.internal.viewportInnerWidth.use();
  const height = state.internal.viewportInnerHeight.use();

  if (!overlayId) return;

  let overlay = overlays[overlayId];
  if (!overlay && overlayId === "lng1771-loading-overlay") overlay = { renderer: LoadingOverlay };
  if (!overlay && overlayId === "lng1771-load-error-overlay")
    overlay = { renderer: LoadErrorOverlay, overRows: true };
  if (!overlay && overlayId === "lng1771-no-data-overlay")
    overlay = { renderer: NoDataOverlay, overRows: true };

  const rowsOnly = !!overlay.overRows;
  return (
    <div
      style={{ position: "sticky", width: 0, height: 0, insetInlineStart: 0, top: 0, zIndex: 20 }}
    >
      <div
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        className={"lng1771-overlay"}
        style={{
          height: rowsOnly ? height - headerHeight : height,
          width,
          top: rowsOnly ? headerHeight : undefined,
        }}
      >
        <overlay.renderer api={api} />
      </div>
    </div>
  );
}
