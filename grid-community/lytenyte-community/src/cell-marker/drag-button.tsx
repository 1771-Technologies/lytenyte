import type { ApiCommunityReact } from "@1771technologies/grid-types";
import { useDragControl } from "./use-drag-control";
import type { RowNode } from "@1771technologies/grid-types/community";
import type { JSX } from "react";
import { GridButton } from "../components/buttons";

export function DragButton({ api, row }: { api: ApiCommunityReact<any>; row: RowNode<any> }) {
  const draggable = useDragControl(api, row);

  return (
    // We need to stop propagation on capture to prevent other drag events like
    // range cell selection from occurring.
    <GridButton {...draggable} onPointerDownCapture={(e) => e.stopPropagation()}>
      <DragDots width={10} height={10} />
    </GridButton>
  );
}

const DragDots = (p: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="currentcolor" {...p}>
      <circle cx="1.75" cy="1.7146" r="1.25" />
      <circle cx="1.75" cy="6.2146" r="1.25" />
      <circle cx="1.75" cy="10.7146" r="1.25" />
      <circle cx="6.25" cy="1.7146" r="1.25" />
      <circle cx="6.25" cy="6.2146" r="1.25" />
      <circle cx="6.25" cy="10.7146" r="1.25" />
    </svg>
  );
};
