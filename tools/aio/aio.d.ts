import "vitest/globals";
import "@vitest/browser/providers/playwright";

/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols
// biome-ignore lint: disable
declare global {
  const css: (typeof import("@linaria/core"))["css"];
}
