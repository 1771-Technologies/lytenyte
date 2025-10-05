import { describe, expect, test, vi } from "vitest";
import { root, tick, untrack } from "../primitives.js";
import { signal, effect } from "../signal.js";

describe("untrack", () => {
  test("should not track scope", () => {
    root((dispose) => {
      const innerEffect = vi.fn();
      let update!: () => void;

      untrack(() => {
        const $a = signal(0);

        effect(() => {
          innerEffect($a());
        });

        update = () => {
          $a.set(10);
        };
      });

      dispose();
      update();
      tick();
      expect(innerEffect).toHaveBeenCalledWith(10);
    });
  });
});
