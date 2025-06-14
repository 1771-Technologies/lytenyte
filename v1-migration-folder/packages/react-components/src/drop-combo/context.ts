import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  type Dispatch,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type SetStateAction,
} from "react";

export interface DropComboState {
  readonly open: boolean;
  readonly focusIndex: number;
  readonly isInputEmpty: boolean;
  readonly selected: string | undefined;
}

export interface DropComboContext {
  readonly getInputProps: () => InputHTMLAttributes<HTMLInputElement>;
  readonly getClearProps: () => ButtonHTMLAttributes<HTMLButtonElement>;
  readonly getToggleProps: () => ButtonHTMLAttributes<HTMLButtonElement>;
  readonly getItemProps: (id: string, index: number) => HTMLAttributes<HTMLElement>;
  readonly getListProps: () => HTMLAttributes<HTMLElement>;

  readonly input: HTMLInputElement | null;
  readonly setInput: Dispatch<SetStateAction<HTMLInputElement | null>>;
  readonly toggle: HTMLElement | null;
  readonly setToggle: Dispatch<SetStateAction<HTMLElement | null>>;

  readonly timeEnter: number;
  readonly timeExit: number;

  readonly state: DropComboState;
}

export const context = createContext<DropComboContext>(null as any);

export const useDropComboRoot = () => useContext(context);
