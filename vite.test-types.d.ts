/* eslint-disable @typescript-eslint/no-empty-object-type */
/// <reference types="@vitest/browser/providers/playwright" />

import "vitest";

interface CustomMatchers<R = unknown> {
  toMatchScreenshot: (filename: string) => Promise<R>;
}

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

declare module "@vitest/browser/context" {
  interface BrowserCommands {
    getPlatform: () => Promise<string>;
    existsFile: (filename: string) => Promise<boolean>;
    compareImages: (left: string, right: string) => Promise<boolean>;
  }
}

import "jest";

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchScreenshot(filename: string): Promise<R>;
    }
  }
}
