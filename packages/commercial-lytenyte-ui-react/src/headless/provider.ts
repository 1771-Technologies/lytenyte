import { createContext, useContext, type CSSProperties } from "react";

export interface LnStyle {
  readonly className?: string;
  readonly style?: CSSProperties;
  [key: `data-${string}`]: string | boolean;
}

export interface LnStyleProvider {
  readonly Dialog?: {
    Arrow?: LnStyle;
    Close?: LnStyle;
    Container?: LnStyle;
    Description?: LnStyle;
    Title?: LnStyle;
    Trigger?: LnStyle;
  };
}

const LnStyleContext = createContext<LnStyleProvider>({
  Dialog: {
    Trigger: {
      "data-ln-button": "secondary",
      "data-ln-size": "md",
    },
  },
});

export const LnStyleProvider = LnStyleContext.Provider;
export const useLnStyle = () => useContext(LnStyleContext);
