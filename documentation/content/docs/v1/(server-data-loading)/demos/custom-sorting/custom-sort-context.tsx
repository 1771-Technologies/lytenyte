import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

export interface CustomSort {
  readonly columnId: string;
  readonly isDescending: boolean;
}

export const context = createContext<{
  sort: CustomSort | null;
  setSort: Dispatch<SetStateAction<CustomSort | null>>;
}>({
  sort: null,
  setSort: () => {},
});
