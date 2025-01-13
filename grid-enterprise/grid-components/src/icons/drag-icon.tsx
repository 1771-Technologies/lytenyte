import { t } from "@1771technologies/grid-design";

export function DragIcon() {
  return (
    <span
      className={css`
        display: grid;
        grid-template-columns: 2px 2px;
        grid-template-rows: 2px 2px 2px;
        grid-row-gap: 2px;
        grid-column-gap: 2px;

        & span {
          background-color: ${t.colors.borders_icons_default};
        }
      `}
    >
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
