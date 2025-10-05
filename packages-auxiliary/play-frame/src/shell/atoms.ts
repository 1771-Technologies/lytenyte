import type { AxeResults } from "axe-core";
import { atom } from "jotai";

export const axeResults$ = atom<AxeResults | null>(null);
export const axeLoading$ = atom<boolean>(false);
