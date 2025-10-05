import { describe, expect, test } from "vitest";
import { root, getScope, peek } from "../primitives.js";
import { effect } from "../signal.js";

describe("getScope", () => {
  test("should return current scope", () => {
    root(() => {
      const rootScope = getScope();
      expect(rootScope).toBeDefined();
      effect(() => {
        expect(getScope()).toBeDefined();
        expect(getScope()).not.toBe(rootScope);
      });
    });
  });

  test("should return parent scope from inside peek", () => {
    root(() => {
      peek(() => {
        expect(getScope()).toBeDefined();
      });
    });
  });
});
