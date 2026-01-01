import { forwardRef, memo, type JSX } from "react";
import { usePillRoot } from "./root.context.js";
import { usePillRow } from "./pill-row.context.js";

function ContainerBase(props: PillContainer.Props, forwarded: PillContainer.Props["ref"]) {
  const { orientation } = usePillRoot();
  const { row } = usePillRow();

  return (
    <div
      {...props}
      ref={forwarded}
      data-ln-pill-container
      data-ln-orientation={orientation}
      data-ln-pill-type={row.type}
    />
  );
}

export const PillContainer = memo(forwardRef(ContainerBase));

export namespace PillContainer {
  export type Props = JSX.IntrinsicElements["div"];
}
