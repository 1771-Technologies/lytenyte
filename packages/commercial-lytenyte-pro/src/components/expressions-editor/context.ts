import { createContext, useContext, type RefObject } from "react";
import type { ChangeEvent, KeyboardEvent, SyntheticEvent, UIEvent } from "react";
import type { ExpressionError } from "../../expressions/errors/index.js";
import type { ExpressionEditorRoot } from "./root.js";
import type { Completion } from "./types.js";

export interface ExpressionEditorContext {
  readonly expression: string;
  readonly onExpressionChange: (change: string) => void;

  readonly tokens: ExpressionEditorRoot.Token[];
  readonly classifier: (token: Omit<ExpressionEditorRoot.Token, "class">) => string;
  readonly errors: ExpressionError[];

  readonly completions: Completion[];
  readonly activeIndex: number;
  readonly isCompletionsLoading: boolean;
  readonly cursorCoords: { top: number; left: number } | null;
  readonly acceptCompletion: (index?: number) => void;
  readonly dismissCompletions: () => void;

  readonly inputRef: RefObject<HTMLTextAreaElement | null>;
  readonly highlightRef: RefObject<HTMLDivElement | null>;
  readonly inputProps: {
    readonly value: string;
    readonly onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    readonly onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
    readonly onSelect: (e: SyntheticEvent<HTMLTextAreaElement>) => void;
    readonly onScroll: (e: UIEvent<HTMLTextAreaElement>) => void;
  };
}

const context = createContext({} as ExpressionEditorContext);

export const ExpressionRootProvider = context.Provider;
export const useExpressionRoot = () => useContext(context);
