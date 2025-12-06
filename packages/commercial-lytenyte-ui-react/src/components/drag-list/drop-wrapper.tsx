import type { JSX } from "react";
import { useDraggable } from "@1771technologies/lytenyte-dnd-react";
import { mergeProps } from "@1771technologies/lytenyte-hooks-react";

export function DragWrapped(props: JSX.IntrinsicElements["div"]) {
  const { props: dragProps } = useDraggable({
    data: {
      x: { kind: "site", data: 1 },
    },
  });

  const finalProps = mergeProps(props, dragProps);

  console.log(dragProps);

  return <div {...finalProps} data-ln-dlist-item />;
}
