import { GridButton } from "@1771technologies/lytenyte-grid-community/internal";
import { useGrid } from "../use-grid";
import { t } from "@1771technologies/grid-design";

export function LoadErrorOverlay() {
  const { state, api } = useGrid();
  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        overflow: hidden;
      `}
    >
      <div
        className={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: ${t.spacing.space_30};
          padding: ${t.spacing.space_30} ${t.spacing.space_50};
          background-color: ${t.colors.backgrounds_ui_panel};
          border: 1px solid ${t.colors.borders_context_menu};
          border-radius: ${t.spacing.box_radius_medium};
        `}
      >
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
