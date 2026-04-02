import type { CSSProperties, ReactNode, KeyboardEvent } from "react";

export type Token = {
  type: string;
  text: string;
  start: number;
  end: number;
  error?: { message: string };
};

export type CompletionItem<T = unknown> = {
  label: string;
  kind: string;
  id: string;
} & T;

export type KeybindingConfig = {
  accept?: string[];
  dismiss?: string[];
  navigateUp?: string[];
  navigateDown?: string[];
};

export type CompletionAction =
  | { type: "navigate"; direction: "up" | "down" }
  | { type: "accept" }
  | { type: "dismiss" }
  | { type: "none" };

export type WordAtCursor = {
  word: string;
  start: number;
  end: number;
};

export type CursorCoordinates = {
  top: number;
  left: number;
  lineHeight: number;
};

export type ExpressionEditorProps<T = unknown> = {
  value: string;
  onValueChange: (value: string) => void;

  tokenize: (value: string) => Token[];
  highlight: (token: Token) => ReactNode;

  completionProvider?: (
    tokens: Token[],
    cursorPosition: number,
  ) => CompletionItem<T>[] | Promise<CompletionItem<T>[]>;
  renderCompletionItem?: (item: CompletionItem<T>) => ReactNode;
  completionClassName?: string;
  renderLoading?: () => ReactNode;

  triggerCharacters?: string[];
  multiline?: boolean;

  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;

  className?: string;
  style?: CSSProperties;

  keybindings?: KeybindingConfig;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
};
