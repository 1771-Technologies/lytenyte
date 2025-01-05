import type { ReactNode } from "react";
import { renderToString } from "react-dom/server";

/**
 * Creates an off-screen DOM element containing rendered React content,
 * typically used as a custom drag image for HTML5 drag and drop operations.
 *
 * @param Content - A React function component that returns the content to be
 * rendered inside the drag placeholder. This component should not take any props.
 *
 * @returns A DOM div element positioned off-screen that contains the rendered
 * React content. The element has the following properties:
 * - Fixed positioning at (-9999px, -9999px)
 * - role="presentation" attribute
 * - Rendered React content as inner HTML
 *
 * @example
 * ```tsx
 * const DragContent = () => <div>Drag Preview</div>;
 * const placeholder = dragPlaceholder(DragContent);
 * event.dataTransfer.setDragImage(placeholder, 0, 0);
 * ```
 */
export function dragPlaceholder(Content: () => ReactNode) {
  const div = document.createElement("div");
  div.style.position = "fixed";
  div.style.top = "-9999px";
  div.style.left = "-9999px";
  div.setAttribute("role", "presentation");

  const content = renderToString(<Content />);

  div.innerHTML = content;

  return div;
}
