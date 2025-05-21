type FocusableElement = HTMLElement | SVGElement;

export type CheckOptions = {
  readonly displayCheck?: "full" | "legacy-full" | "non-zero-area" | "none";
  readonly getShadowRoot?: boolean | ((node: FocusableElement) => ShadowRoot | boolean | undefined);
};

export type TabbableOptions = {
  readonly includeContainer?: boolean;
};
