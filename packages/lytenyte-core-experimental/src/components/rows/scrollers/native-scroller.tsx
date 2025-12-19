import type { PropsWithChildren } from "react";
import { useRoot } from "../../../root/root-context.js";

export function NativeScroller(props: PropsWithChildren) {
  const { id } = useRoot();
  return (
    <div data-ln-gridid={id} role="presentation">
      {props.children}
    </div>
  );
}
