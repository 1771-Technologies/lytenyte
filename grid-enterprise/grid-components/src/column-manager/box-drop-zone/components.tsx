import { t } from "@1771technologies/grid-design";
import { IconButton } from "../../buttons/icon-button";
import type { JSX } from "react";
import { DragIcon } from "../../icons/drag-icon";
import { CrossIcon } from "../../icons/cross-icon";

export const CollapsedIcon = (p: { onClick: () => void }) => {
  return (
    <IconButton
      tabIndex={-1}
      kind="ghost"
      small
      onClick={p.onClick}
      className={css`
        transform: rotate(-90deg);
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

export const ExpandedIcon = (p: { onClick: () => void }) => {
  return (
    <IconButton
      tabIndex={-1}
      kind="ghost"
      onClick={p.onClick}
      small
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

export function PillDragger(props: JSX.IntrinsicElements["div"]) {
  return (
    <div
      {...props}
      className={css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        transform: translate(0px, 1px);
      `}
    >
      <DragIcon />
    </div>
  );
}

export function PillDelete(props: JSX.IntrinsicElements["div"]) {
  return (
    <div
      {...props}
      className={css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        transform: translate(0px, -1px);
      `}
    >
      <CrossIcon />
    </div>
  );
}
