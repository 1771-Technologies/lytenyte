import {
  createContext,
  useContext,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";

export interface TooltipGroupContext {
  readonly groupOpen: boolean;
  readonly setGroupOpen: Dispatch<SetStateAction<boolean>>;
  readonly openGroupId: string;
  readonly setOpenGroupId: Dispatch<SetStateAction<string>>;
  readonly groupClose: RefObject<null | (() => void)>;
  readonly groupShowDelay: number;
  readonly groupHideDelay: number;
}

export const context = createContext<TooltipGroupContext | null>(null);
export const useTooltipGroup = () => useContext(context);

export interface TooltipRootContext {
  readonly open: boolean;

  readonly trigger: HTMLElement | null;
  readonly triggerRef: Dispatch<SetStateAction<HTMLElement | null>>;
  readonly content: HTMLElement | null;
  readonly contentRef: Dispatch<SetStateAction<HTMLElement | null>>;

  readonly beginOpen: () => void;
  readonly beginClose: () => void;

  readonly mountTime: number;
  readonly unmountTime: number;

  readonly interactive: boolean;
}

export const contextRoot = createContext<TooltipRootContext>({} as any);
export const useTooltipRoot = () => useContext(contextRoot);
