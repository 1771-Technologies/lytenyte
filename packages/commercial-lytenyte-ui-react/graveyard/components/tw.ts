import { twMerge } from "../external/tailwind-merge.js";
import clsx, { type ClassValue } from "../external/clsx.js";

export function tw(...args: ClassValue[]) {
  return twMerge(clsx(args));
}
