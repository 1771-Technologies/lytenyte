import { t } from "@1771technologies/grid-design";

export const DefaultDelete = () => {
  return (
    <button
      className={css`
        &:focus {
          background-color: ${t.colors.backgrounds_light};
          border: 1px solid ${t.colors.borders_focus};
          outline: none;
        }
        background-color: transparent;
        border: 1px solid transparent;
        border-radius: ${t.spacing.box_radius_regular};
        color: ${t.colors.borders_icons_default};
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      ⛌
    </button>
  );
};
