import type { PropsWithChildren } from "react";
import { useGridRoot } from "../../root/context.js";

export function NativeScroller(props: PropsWithChildren) {
  const { id } = useGridRoot();
  return (
    <div data-ln-gridid={id} role="presentation">
      {props.children}
    </div>
  );
}
