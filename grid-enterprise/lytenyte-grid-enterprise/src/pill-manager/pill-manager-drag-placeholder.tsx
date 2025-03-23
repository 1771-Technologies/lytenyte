import {
  useDrag,
  useDragStore,
  type DragActive,
} from "@1771technologies/lytenyte-grid-community/internal";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export function PillManagerDragPlaceholder(props: {
  readonly children?: (p: DragActive) => ReactNode;
}) {
  const store = useDragStore();

  const s = useDrag(store, (s) => s.active);

  if (!s) return null;

  const c = props.children ?? DefaultPlaceholder;

  return createPortal(
    <div
      className="lng1771-pill-manager__drag-placeholder"
      style={{ transform: `translate3d(${s.x}px, ${s.y}px, 0px)` }}
    >
      {c(s)}
    </div>,
    document.body,
  );
}

function DefaultPlaceholder(p: DragActive) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20px"
        height="20px"
        fill="currentcolor"
        viewBox="0 0 256 256"
      >
        <path d="M90.34,61.66a8,8,0,0,1,0-11.32l32-32a8,8,0,0,1,11.32,0l32,32a8,8,0,0,1-11.32,11.32L136,43.31V96a8,8,0,0,1-16,0V43.31L101.66,61.66A8,8,0,0,1,90.34,61.66Zm64,132.68L136,212.69V160a8,8,0,0,0-16,0v52.69l-18.34-18.35a8,8,0,0,0-11.32,11.32l32,32a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Zm83.32-72-32-32a8,8,0,0,0-11.32,11.32L212.69,120H160a8,8,0,0,0,0,16h52.69l-18.35,18.34a8,8,0,0,0,11.32,11.32l32-32A8,8,0,0,0,237.66,122.34ZM43.31,136H96a8,8,0,0,0,0-16H43.31l18.35-18.34A8,8,0,0,0,50.34,90.34l-32,32a8,8,0,0,0,0,11.32l32,32a8,8,0,0,0,11.32-11.32Z"></path>
      </svg>
      <span>{p.id}</span>
    </div>
  );
}
