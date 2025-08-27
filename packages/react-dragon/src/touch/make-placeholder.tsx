import type { DragData } from "../+types";
import type { UseDraggableProps } from "../use-draggable";

export function makePlaceholder(
  placeholder: UseDraggableProps["placeholder"],
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

    placeholderElement = placeholder(data, dragElement);
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
