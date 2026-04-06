import type { CSSProperties, ReactNode } from "react";
import type { Token } from "../../expressions/lexer/types.js";

export type CompletionItem = {
  label: string;
  kind: string;
  id: string;
};

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

export type ExpressionEditorProps = {
  value: string;
  onChange: (value: string) => void;

  tokenize: (value: string) => Token[];
  highlight?: (props: { token: Token }) => ReactNode;

  completionProvider?: (tokens: Token[], index: number) => CompletionItem[] | Promise<CompletionItem[]>;

  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;

  className?: string;
  style?: CSSProperties;
};
