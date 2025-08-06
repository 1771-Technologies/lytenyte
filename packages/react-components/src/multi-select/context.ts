import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  type Dispatch,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type SetStateAction,
} from "react";

export interface MultiSelectState {
  readonly open: boolean;
  readonly focusIndex: number;
  readonly isInputEmpty: boolean;
  readonly selected: string[];
}

export interface MultiSelectContext {
  readonly getLabelProps: () => LabelHTMLAttributes<HTMLLabelElement>;
  readonly getFocusCaptureProps: () => HTMLAttributes<HTMLElement>;
  readonly getInputProps: () => InputHTMLAttributes<HTMLInputElement>;
  readonly getClearProps: () => ButtonHTMLAttributes<HTMLButtonElement>;
  readonly getToggleProps: () => ButtonHTMLAttributes<HTMLButtonElement>;
  readonly getItemProps: (id: string, index: number) => HTMLAttributes<HTMLElement>;
  readonly getListProps: () => HTMLAttributes<HTMLElement>;

  readonly input: HTMLInputElement | null;
  readonly setInput: Dispatch<SetStateAction<HTMLInputElement | null>>;
  readonly toggle: HTMLElement | null;
  readonly setToggle: Dispatch<SetStateAction<HTMLElement | null>>;

  readonly removeSelect: (s: string | undefined) => void;
  readonly isItemSelected: (s: string) => boolean;
  readonly isTagActive: (s: string) => boolean;

  readonly timeEnter: number;
  readonly timeExit: number;

  readonly state: MultiSelectState;

  readonly isDrop: boolean;
}

export const context = createContext<MultiSelectContext>(null as any);

export const useMultiSelectRoot = () => useContext(context);
