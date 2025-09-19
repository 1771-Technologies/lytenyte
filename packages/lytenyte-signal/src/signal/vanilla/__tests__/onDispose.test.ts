import { afterEach, describe, expect, test, vi } from "vitest";
import { getScope, onDispose, onError, root, scoped, tick } from "../primitives.js";
import { createScope } from "../create-computation.js";
import { effect } from "../signal.js";
import { G } from "../../+globals.js";
import { NOOP } from "../../+constants.js";

describe("onDispose", () => {
  afterEach(() => tick());

  test("should be invoked when computation is disposed", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const callback3 = vi.fn();

    const stop = effect(() => {
      onDispose(callback1);
      onDispose(callback2);
      onDispose(callback3);
    });

    stop();

    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
    expect(callback3).toHaveBeenCalled();
  });

  test("should clear disposal early", () => {
    const dispose = vi.fn();

    const stop = effect(() => {
      const early = onDispose(dispose);
      early();
    });

    expect(dispose).toHaveBeenCalledTimes(1);

    stop();
    tick();

    expect(dispose).toHaveBeenCalledTimes(1);
  });

  test("should not trigger wrong onDispose", () => {
    const dispose = vi.fn();

    root(() => {
      effect(() => {
        onDispose(dispose);
      });

      const stop = effect(() => {});

      stop();
      tick();

      expect(dispose).toHaveBeenCalledTimes(0);
    });
  });

  test("should dispose in-reverse-order", () => {
    let a, b, c;

    const dispose = root((dispose) => {
      onDispose(() => {
        a = performance.now();
      });

      effect(() => {
        onDispose(() => {
          b = performance.now();
        });

        effect(() => {
          onDispose(() => {
            c = performance.now();
          });
        });
      });

      return dispose;
    });

    dispose();
    expect(c! < b! && b! < a!).toBe(true);
  });

  test("should dispose all roots", () => {
    const disposals: string[] = [];

    const dispose = root((dispose) => {
      onDispose(() => disposals.push("root"));
      onDispose(() => disposals.push("root_2"));

      root(() => {
        onDispose(() => disposals.push("s1"));
        effect(() => onDispose(() => disposals.push("s1_effect_1")));
        effect(() => onDispose(() => disposals.push("s1_effect_2")));
        effect(() => onDispose(() => disposals.push("s1_effect_3")));
      });

      root(() => {
        onDispose(() => disposals.push("s2"));
        effect(() => onDispose(() => disposals.push("s2_effect_1")));
        effect(() => onDispose(() => disposals.push("s2_effect_2")));
        effect(() => onDispose(() => disposals.push("s2_effect_3")));
      });

      return dispose;
    });

    dispose();
    expect(disposals).toMatchInlineSnapshot(`
    [
      "s2_effect_3",
      "s2_effect_2",
      "s2_effect_1",
      "s2",
      "s1_effect_3",
      "s1_effect_2",
      "s1_effect_1",
      "s1",
      "root_2",
      "root",
    ]
  `);
  });

  test("should handle a dispose that throws", () => {
    const fn = vi.fn();
    const dispose = root((dispose) => {
      onDispose(() => {
        throw new Error("I ran");
      });

      onError((error) => {
        fn(error);
      });
      return dispose;
    });

    dispose();
    expect(fn).toHaveBeenCalledOnce();
  });

  test("should correctly handle null disposable scopes", () => {
    const current = G.currentScope;

    const fn = vi.fn();
    const fn2 = vi.fn();

    G.currentScope = null;
    expect(onDispose(fn)).toBe(fn);
    G.currentScope = current;
    expect(onDispose(null)).toBe(NOOP);

    const d = root((dispose) => {
      let r: () => void = () => {};
      let scope;

      effect(() => {
        scope = getScope();

        r = onDispose(fn);
        onDispose(fn2);
      });

      return { dispose, r, scope };
    });
    tick();

    d.r();
    (d.scope as any)._disposal = null;
    d.r();
    d.dispose();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test("should be able to remove a disposable from an array", () => {});

  test("should dispose correctly on appended scopes", () => {
    const disposals: string[] = [];

    const scopeA = createScope(),
      scopeB = createScope();

    scoped(() => {
      onDispose(() => disposals.push("scope_a"));
      effect(() => {
        effect(() => {
          return () => {
            disposals.push("a_effect_two");
          };
        });
        return () => {
          disposals.push("a_effect_one");
        };
      });
    }, scopeA);

    scoped(() => {
      onDispose(() => disposals.push("scope_b"));
      effect(() => {
        effect(() => {
          return () => {
            disposals.push("b_effect_two");
          };
        });
        return () => {
          disposals.push("b_effect_one");
        };
      });
    }, scopeB);

    scopeA.append(scopeB);
    scopeB.dispose();
    expect(disposals).toMatchInlineSnapshot(`
    [
      "b_effect_two",
      "b_effect_one",
      "scope_b",
    ]
  `);

    scopeA.dispose();
    expect(disposals).toMatchInlineSnapshot(`
    [
      "b_effect_two",
      "b_effect_one",
      "scope_b",
      "a_effect_two",
      "a_effect_one",
      "scope_a",
    ]
  `);
  });
});
