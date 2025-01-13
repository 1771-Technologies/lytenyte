import { t } from "@1771technologies/grid-design";
import { IconButton } from "../buttons/icon-button";

export const ExpandedIcon = () => {
  return (
    <IconButton
      tabIndex={-1}
      kind="ghost"
      small
      onFocus={(ev) => ev.currentTarget.blur()}
      className={css`
        transform: rotate(90deg);
        color: ${t.colors.borders_icons_default};
        font-size: 20px;
      `}
    >
      <span
        className={css`
          position: relative;
          inset-block-end: 2px;
        `}
      >
        ›
      </span>
    </IconButton>
  );
};

export const CollapsedIcon = () => {
  return (
    <IconButton
      tabIndex={-1}
      kind="ghost"
      small
      className={css`
        color: ${t.colors.borders_icons_default};
        font-size: 20px;
      `}
    >
      <span
        className={css`
          position: relative;
          inset-block-end: 2px;
        `}
      >
        ›
      </span>
    </IconButton>
  );
};

export const DragIcon = () => {
  return (
    <IconButton kind="ghost" small>
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
    </IconButton>
  );
};
