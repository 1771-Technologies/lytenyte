import { describe, expect, test, vi } from "vitest";
import { getContext, getScope, onError, root, scoped, setContext } from "../primitives.js";
import type { Scope } from "../../+types.js";

describe("scoped", () => {
  test("should scope function to current scope", () => {
    let scope!: Scope | null;
    root(() => {
      scope = getScope();
      setContext("id", 10);
    });

    scoped(() => expect(getContext("id")).toBe(10), scope);
  });

  test("should return value", () => {
    expect(scoped(() => 100, null)).toBe(100);
  });

  test("should handle errors", () => {
    const error = new Error(),
      handler = vi.fn();

    let scope!: Scope | null;
    root(() => {
      scope = getScope();
      onError(handler);
    });

    scoped(() => {
      throw error;
    }, scope);

    expect(handler).toHaveBeenCalledWith(error);
  });
});
