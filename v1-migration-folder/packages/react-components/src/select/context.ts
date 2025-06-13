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

export interface SelectContext {
  readonly getFocusCaptureProps: () => HTMLAttributes<HTMLElement>;
  readonly getLabelProps: () => LabelHTMLAttributes<HTMLLabelElement>;
  readonly getInputProps: () => InputHTMLAttributes<HTMLInputElement>;
  readonly getClearProps: () => ButtonHTMLAttributes<HTMLButtonElement>;
  readonly getToggleProps: () => ButtonHTMLAttributes<HTMLButtonElement>;
  readonly getListProps: () => HTMLAttributes<HTMLElement>;
  readonly getItemProps: (id: string, index: number) => HTMLAttributes<HTMLElement>;

  readonly timeEnter: number;
  readonly timeExit: number;

  readonly input: HTMLInputElement | null;
  readonly setInput: Dispatch<SetStateAction<HTMLInputElement | null>>;

  readonly state: SelectState;
}

export interface SelectState {
  readonly open: boolean;
  readonly focusIndex: number;
  readonly isInputEmpty: boolean;

  readonly value: string | undefined;
  readonly selected: string | undefined;
}

export const context = createContext<SelectContext>(null as any);

export const useSelectRoot = () => useContext(context);
