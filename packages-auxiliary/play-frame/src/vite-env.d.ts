/// <reference types="vite/client" />

declare module "playframe" {
  import type { ReactNode } from "react";
  const frame: Record<string, { default?: () => ReactNode }>;

  export default frame;
}
