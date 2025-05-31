import type { Dimensions } from "../../core/index.js";

import { getCssDimensions } from "../utils/getCssDimensions.js";

export function getDimensions(element: Element): Dimensions {
  const { width, height } = getCssDimensions(element);
  return { width, height };
}
