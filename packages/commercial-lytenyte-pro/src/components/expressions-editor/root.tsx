import { forwardRef, memo, useMemo, useRef, type JSX } from "react";
import { ExpressionRootProvider, type ExpressionEditorContext } from "./context.js";
import { useEvent } from "@1771technologies/lytenyte-core/internal";
import type { Evaluator } from "../../expressions/index.js";
import { ExpressionError } from "../../expressions/errors/expression-error.js";
import type { BaseToken } from "../../expressions/lexer/types.js";
import { defaultTokenClassifier } from "./token-classifier.js";
import { useCompletions } from "./use-completions.js";
import type { Completion, CompletionContext, CompletionProvider } from "./types.js";

const noop = () => {};

function EditorRootImpl(
  {
    evaluator,
    expression,
    onExpressionChange: providedChange,
    tokenClassifier = defaultTokenClassifier,
    completionProviders,
    getCompletions,
    children,
    ...props
  }: ExpressionEditorRoot.Props,
  ref: ExpressionEditorRoot.Props["ref"],
) {
  const onExpressionChange = useEvent(providedChange ?? noop);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);

  const { tokens, errors } = useMemo<{
    tokens: ExpressionEditorRoot.Token[];
    errors: ExpressionError[];
  }>(() => {
    try {
      const { tokens, error } = evaluator.tokensSafe(expression);
      return {
        tokens: tokens.filter((x) => x.type !== "EOF").map((x) => ({ ...x, class: tokenClassifier(x) })),
        errors: error ? [error] : [],
      };
    } catch (e) {
      return { tokens: [], errors: e instanceof ExpressionError ? [e] : [] };
    }
  }, [evaluator, expression, tokenClassifier]);

  const completionsResult = useCompletions({
    expression,
    onExpressionChange,
    tokens,
    inputRef,
    highlightRef,
    completionProviders,
    getCompletions,
  });

  const value = useMemo<ExpressionEditorContext>(() => {
    return {
      expression,
      onExpressionChange,
      classifier: tokenClassifier,
      highlightRef,
      inputRef,
      tokens,
      errors,
      completions: completionsResult.completions,
      activeIndex: completionsResult.activeIndex,
      isCompletionsLoading: completionsResult.isCompletionsLoading,
      cursorCoords: completionsResult.cursorCoords,
      acceptCompletion: completionsResult.acceptCompletion,
      dismissCompletions: completionsResult.dismissCompletions,
      inputProps: completionsResult.inputProps,
    };
  }, [errors, expression, onExpressionChange, tokenClassifier, tokens, completionsResult]);

  return (
    <ExpressionRootProvider value={value}>
      <div {...props} data-ln-expression-root ref={ref}>
        {children}
      </div>
    </ExpressionRootProvider>
  );
}

export const EditorRoot = memo(forwardRef(EditorRootImpl));

export namespace ExpressionEditorRoot {
  export type Token = BaseToken & { type: string; value: string; class: string };

  export type Props = JSX.IntrinsicElements["div"] & {
    readonly expression: string;
    readonly onExpressionChange?: (change: string) => void;
    readonly tokenClassifier?: (token: Omit<Token, "class">) => string;
    readonly evaluator: Evaluator;
    readonly completionProviders?: CompletionProvider[];
    readonly getCompletions?: (ctx: CompletionContext) => Completion[] | null | Promise<Completion[] | null>;
  };
}
