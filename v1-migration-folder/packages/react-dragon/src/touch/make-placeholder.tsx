import { createRoot } from "react-dom/client";
import type { DragData } from "../+types";
import type { UseDraggable } from "../use-draggable";

export function makePlaceholder(
  placeholder: UseDraggable["placeholder"],
  dragElement: HTMLElement,
  data: DragData,
  x: number,
  y: number,
  offX: number,
  offY: number,
) {
  let placeholderElement;
  if (placeholder) {
    const cr = document.createElement("div");
    cr.style.pointerEvents = "none";
    cr.style.position = "fixed";
    cr.style.zIndex = "1000";
    cr.style.top = `${y + offY}px`;
    cr.style.left = `${x + offX}px`;

    const root = createRoot(cr);
    root.render(<>{placeholder(data)}</>);

    placeholderElement = cr;
    document.body.append(placeholderElement);
  } else {
    const cr = dragElement.cloneNode(true) as HTMLElement;
    cr.style.pointerEvents = "none";
    cr.style.position = "fixed";
    cr.style.zIndex = "1000";
    cr.style.top = `${y}px`;
    cr.style.left = `${x}px`;

    document.body.append(cr);
    placeholderElement = cr;
  }

  return placeholderElement;
}
