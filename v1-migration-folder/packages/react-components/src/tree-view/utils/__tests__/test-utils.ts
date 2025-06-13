import htm from "htm";
import h from "hyperscript";

export const html = htm.bind(h);
export const append = (h: Element | Element[]) => {
  if (Array.isArray(h)) h.forEach((el) => document.body.append(el));
  else document.body.append(h);
};
