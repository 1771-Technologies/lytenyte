import type { PropsWithChildren } from "react";

export function NativeScroller(props: PropsWithChildren) {
  return <div role="presentation">{props.children}</div>;
}
