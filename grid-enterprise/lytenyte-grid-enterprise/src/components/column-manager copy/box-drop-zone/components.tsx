import { t } from "@1771technologies/grid-design";
import type { JSX } from "react";
import { Button } from "../../../components-internal/button/button";
import { CrossIcon, DragIcon } from "@1771technologies/lytenyte-grid-community/icons";

export const CollapsedIcon = (p: { onClick: () => void }) => {
  return (
    <Button
      tabIndex={-1}
      kind="tertiary"
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
    </Button>
  );
};

export const ExpandedIcon = (p: { onClick: () => void }) => {
  return (
    <Button
      tabIndex={-1}
      kind="tertiary"
      onClick={p.onClick}
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
    </Button>
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
        cursor: pointer;
        width: 20px;
        height: 20px;
        transform: translate(0px, -1px);
      `}
    >
      <CrossIcon />
    </div>
  );
}
