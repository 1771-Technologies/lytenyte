import type { PropsWithChildren } from "react";

export function DateTag(props: PropsWithChildren) {
  return <div className="font-mono text-sm">{props.children}</div>;
}
