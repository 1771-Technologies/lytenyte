import type { PropsWithChildren } from "react";
import { useGridRoot } from "../../context.js";

export function NativeScroller(props: PropsWithChildren) {
  const { gridId } = useGridRoot();
  return (
    <div data-ln-gridid={gridId} role="presentation">
      {props.children}
    </div>
  );
}
