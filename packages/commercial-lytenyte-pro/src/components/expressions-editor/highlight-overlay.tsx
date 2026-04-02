import { Fragment, type ReactNode } from "react";
import type { Token } from "./types";

interface HighlightOverlayProps {
  readonly tokens: Token[];
  readonly highlight: (token: Token) => ReactNode;
}

export function HighlightOverlay({ tokens, highlight }: HighlightOverlayProps) {
  return (
    <>
      {tokens.map((token) => (
        <Fragment key={token.start}>{highlight(token)}</Fragment>
      ))}
    </>
  );
}
