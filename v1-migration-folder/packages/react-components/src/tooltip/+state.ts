import { atom } from "@1771technologies/atom";
import type { Tooltip } from "./+types.js";

export const tooltips = atom(new Map<string, Tooltip>());
export const visibleTooltips = atom((get) => [...get(tooltips).values()]);

export const tooltipQueue = new Map<string, ReturnType<typeof setTimeout>>();
