import { describe, expect, test } from "vitest";
import { getContext, getScope, root, setContext } from "../primitives.js";
import type { Scope } from "../../+types.js";
import { effect } from "../signal.js";

describe("context", () => {
  test("should get context value", () => {
    const key = Symbol();
    root(() => {
      setContext(key, 100);
      root(() => {
        root(() => {
          setContext(key, 200);
        });

        effect(() => {
          expect(getContext(key)).toBe(100);
        });
      });
    });
  });

  test("should not throw if no context value is found", () => {
    const key = Symbol();
    root(() => {
      root(() => {
        effect(() => {
          expect(getContext(key)).toBe(undefined);
        });
      });
    });

    root(() => {
      root(() => {
        effect(() => {});
      });
    });
  });

  test("should be able to set the context", () => {
    const key = Symbol();
    root(() => {
      root(() => {
        effect(() => {
          setContext(Symbol(), {}, null);
          expect(getContext(key)).toBe(undefined);
          setContext(key, "12");
          expect(getContext(key)).toBe("12");
        });
      });
    });
  });

  test("should use provided scope", () => {
    let scope!: Scope;
    const key = Symbol();

    root(() => {
      scope = getScope()!;
      root(() => {
        effect(() => {
          setContext(key, 200, scope);
        });
      });
    });

    root(() => {
      expect(getContext(key)).toBeUndefined();
      expect(getContext(key, scope)).toBe(200);
    });
  });
});
