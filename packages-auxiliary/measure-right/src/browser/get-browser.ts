import { chromium, type Browser } from "playwright";
import { getBrowserPath } from "./get-browser-path.js";
import type { BrowserOptions } from "../types.js";

export async function startBrowser(p: BrowserOptions = {}): Promise<Browser> {
  const headless = p.headless ?? true;

  const args = ["--js-flags=--expose-gc", "--enable-benchmarking"];
  if (headless) args.push("--headless=new");

  const browser = await chromium.launch({
    args,
    headless: false,
    executablePath: getBrowserPath(p.path),
  });

  return browser;
}
