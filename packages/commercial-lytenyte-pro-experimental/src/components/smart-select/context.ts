import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { BaseOption, SmartSelectKinds } from "./type";

export interface SmartSelectContext {
  readonly kindAndValue: SmartSelectKinds<BaseOption>;
  readonly open: boolean;
  readonly onOpenChange: (b: boolean) => void;

  readonly closeOnSelect: boolean;
  readonly onOptionSelect: (b: BaseOption) => void;

  readonly trigger: HTMLElement | null;
  readonly setTrigger: Dispatch<SetStateAction<HTMLElement | null>>;

  readonly activeId: string | null;
  readonly setActiveId: Dispatch<SetStateAction<string | null>>;

  readonly container: HTMLElement | null;
  readonly setContainer: Dispatch<SetStateAction<HTMLElement | null>>;
}

const context = createContext({} as SmartSelectContext);

export const SmartSelectProvider = context.Provider;
export const useSmartSelect = () => useContext(context);
