import type { PropsWithChildren } from "react";
import { useGridId } from "../../../root/contexts/grid-id.js";

export function NativeScroller(props: PropsWithChildren) {
  const id = useGridId();
  return (
    <div data-ln-gridid={id} role="presentation">
      {props.children}
    </div>
  );
}
