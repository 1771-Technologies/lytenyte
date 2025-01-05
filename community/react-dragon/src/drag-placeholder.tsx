import type { ReactNode } from "react";
import { renderToString } from "react-dom/server";

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
