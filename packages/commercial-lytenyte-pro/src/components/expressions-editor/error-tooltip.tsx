import type { ReactNode } from "react";
import type { Token } from "./types.js";

interface ErrorTooltipProps {
  readonly token: Token;
  readonly children: ReactNode;
}

export function ErrorTooltip({ token, children }: ErrorTooltipProps) {
  if (!token.error) {
    return <>{children}</>;
  }

  return (
    <span
      style={{
        position: "relative",
        textDecoration: "wavy underline red",
        textUnderlineOffset: "3px",
      }}
      title={token.error.message}
    >
      {children}
    </span>
  );
}
