import { t } from "@1771technologies/grid-design";

export function LoadingOverlay() {
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
          padding: ${t.spacing.space_30} ${t.spacing.space_50};
          background-color: ${t.colors.backgrounds_ui_panel};
          border: 1px solid ${t.colors.borders_context_menu};
          border-radius: ${t.spacing.box_radius_medium};
        `}
      >
        Loading...
      </div>
    </div>
  );
}
