import type { CSSProperties } from "react";

export type GridStyle = {
  readonly viewport?: {
    readonly style?: CSSProperties;
    readonly className?: string;
  };
  readonly row?: {
    readonly style?: CSSProperties;
    readonly className?: string;
  };
  readonly header?: {
    readonly style?: CSSProperties;
    readonly className?: string;
  };
  readonly detail?: {
    readonly style?: CSSProperties;
    readonly className?: string;
  };
  readonly headerGroup?: {
    readonly style?: CSSProperties;
    readonly className?: string;
  };
  readonly cell?: {
    readonly style?: CSSProperties;
    readonly className?: string;
  };
};
