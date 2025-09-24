import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Archivo, Inter } from "next/font/google";
import { LoadProvider } from "./load-provider";
import { cn } from "@/components/cn";
import type { PropsWithChildren } from "react";

const inter = Inter({
  subsets: ["latin"],
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-archivo", // Optional: for CSS variable support
});

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={cn(inter.className, archivo.variable)} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          <LoadProvider>{children}</LoadProvider>
        </RootProvider>
      </body>
    </html>
  );
}
