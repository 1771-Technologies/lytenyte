import "@/app/global.css";
import { Analytics } from "@vercel/analytics/next";
import { RootProvider } from "fumadocs-ui/provider";
import { Archivo, Inter } from "next/font/google";
import { LoadProvider } from "./load-provider";
import { cn } from "@/components/cn";
import type { PropsWithChildren } from "react";
import Script from "next/script";

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
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_G}`}
      />
      <Script id="" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.GOOGLE_G}');`}
      </Script>
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          <Analytics />
          <LoadProvider>{children}</LoadProvider>
        </RootProvider>
      </body>
    </html>
  );
}
