/// <reference types="vite/client" />

declare module "playframe" {
  import type { ReactNode } from "react";
  const frames: Record<string, () => Promise<{ default?: () => ReactNode }>>;

  export default frames;
}

declare module "playframe-setup" {}

declare module "playframe-config" {
  const config: {
    setup?: string;
    themes: {
      attribute: string;
      values: Array<{ name: string; value: string; colorScheme: "light" | "dark" }>;
    };
  };

  export default config;
}
