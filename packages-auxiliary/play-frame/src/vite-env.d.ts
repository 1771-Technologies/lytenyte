/// <reference types="vite/client" />

declare module "playframe" {
  import type { ReactNode } from "react";
  const frame: Record<string, { default?: () => ReactNode }>;

  export default frame;
}

declare module "playframe-setup" {}

declare module "playframe-config" {
  const config: {
    themes: {
      attribute: string;
      values: Array<{ name: string; value: string; colorScheme: "light" | "dark" }>;
    };
  };

  export default config;
}
