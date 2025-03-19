import type { JSX } from "react";
import { Button } from "../../../components-internal/button/button";
import { CrossIcon, DragIcon } from "@1771technologies/lytenyte-grid-community/icons";

export const CollapsedIcon = (p: { onClick: () => void }) => {
  return (
    <Button
      tabIndex={-1}
      kind="tertiary"
      onClick={p.onClick}
      className="lng1771-box-collapse-button"
    >
      <span>›</span>
    </Button>
  );
};

export const ExpandedIcon = (p: { onClick: () => void }) => {
  return (
    <Button tabIndex={-1} kind="tertiary" onClick={p.onClick} className="lng1771-box-expand-button">
      <span>›</span>
    </Button>
  );
};

export function PillDragger(props: JSX.IntrinsicElements["div"]) {
  return (
    <div {...props} className="lng1771-box-pill-dragger">
      <DragIcon />
    </div>
  );
}

export function PillDelete(props: JSX.IntrinsicElements["div"]) {
  return (
    <div {...props} className="lng1771-box-pill-delete">
      <CrossIcon />
    </div>
  );
}
