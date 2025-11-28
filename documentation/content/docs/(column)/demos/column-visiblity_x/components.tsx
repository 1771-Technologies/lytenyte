import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}
