import { forwardRef, Fragment, memo, useMemo, type JSX, type ReactNode } from "react";
import type { ExpressionError } from "../../expressions/errors/index.js";
import { useExpressionRoot } from "./context.js";
import { useCombinedRefs } from "@1771technologies/lytenyte-core/internal";
import type { ExpressionEditorRoot } from "./root.js";

const defaultRender = (params: EditorHighlight.TokenRendererParams): ReactNode => {
  return (
    <span data-ln-expression-token={params.token.type} style={{ color: `var(--ln-${params.token.class})` }}>
      {params.text}
    </span>
  );
};

function EditorHighlightImpl(
  { children = defaultRender, ...props }: EditorHighlight.Props,
  forwarded: EditorHighlight.Props["ref"],
) {
  const { expression, tokens, errors, highlightRef, classifier } = useExpressionRoot();

  const nodes = useMemo<ReactNode[]>(() => {
    const n: ReactNode[] = [];

    tokens.forEach((token, i) => {
      const prevEnd = i === 0 ? 0 : tokens[i - 1].end;
      const gap = expression.slice(prevEnd, token.start);
      if (gap) n.push(<span key={`ws-${token.start}`}>{gap}</span>);

      const params: EditorHighlight.TokenRendererParams = {
        token,
        text: expression.slice(token.start, token.end),
        index: i,
        tokens: tokens,
      };
      n.push(<Fragment key={token.start}>{children(params)}</Fragment>);
    });

    return n;
  }, [children, expression, tokens]);

  const combined = useCombinedRefs(highlightRef, forwarded);

  const completeTokens = useMemo(() => {
    const covered = tokens.at(-1)?.end ?? 0;
    const uncovered = expression.slice(covered);
    if (!uncovered) return [...nodes, <span key="__ln_tail">{"\u00a0"}</span>];

    const errorToken: ExpressionEditorRoot.Token = {
      class: "",
      start: covered,
      end: expression.length,
      type: "TokenError",
      value: uncovered,
    };
    const tokenClass = classifier(errorToken);
    Object.assign(errorToken, { class: tokenClass });

    const errorNode = children({
      tokens,
      index: tokens.length,
      text: uncovered,
      token: errorToken,
      error: errors[0],
    });

    return [
      ...nodes,
      <Fragment key="__ln_error">{errorNode}</Fragment>,
      <span key="__ln_tail">{"\u00a0"}</span>,
    ];
  }, [children, classifier, errors, expression, nodes, tokens]);

  return (
    <div aria-hidden {...props} data-ln-expression-highlight ref={combined}>
      {completeTokens}
    </div>
  );
}

export const EditorHighlight = memo(forwardRef(EditorHighlightImpl));

export namespace EditorHighlight {
  export interface TokenRendererParams {
    readonly token: ExpressionEditorRoot.Token;
    readonly text: string;
    readonly error?: ExpressionError;
    readonly index: number;
    readonly tokens: ExpressionEditorRoot.Token[];
  }

  export type TokenRenderer = (params: TokenRendererParams) => ReactNode;

  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & { children?: TokenRenderer };
}
