import type { PropsWithChildren } from "react";
import { useGridIdContext } from "../../../root/contexts/grid-id.js";

export function NativeScroller(props: PropsWithChildren) {
  const id = useGridIdContext();
  return (
    <div data-ln-gridid={id} role="presentation">
      {props.children}
    </div>
  );
}
