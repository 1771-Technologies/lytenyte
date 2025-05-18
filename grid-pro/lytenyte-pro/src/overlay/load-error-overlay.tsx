import "./load-error-overlay.css";
import { GridButton } from "@1771technologies/lytenyte-core/internal";
import { useGrid } from "../use-grid";

export function LoadErrorOverlay() {
  const { state, api } = useGrid();
  return (
    <div className="lng1771-loading-error-overlay">
      <div className="lng1771-loading-error-overlay__container">
        <div>Loading data from external source failed.</div>
        <GridButton
          onClick={() => {
            state.overlayToShow.set(null);
            api.rowReload();
          }}
          style={{ marginInlineStart: 4 }}
        >
          Retry?
        </GridButton>
      </div>
    </div>
  );
}
