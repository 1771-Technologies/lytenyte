import "../main.css";

import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

export default async function RootElement({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
