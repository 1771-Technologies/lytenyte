import { describe, expect, it as test } from "vitest";
import { computed, effect, signal } from "../signal.js";
import { getScope, root, tick } from "../primitives.js";

function gc() {
  return new Promise((resolve) =>
    setTimeout(async () => {
      tick(); // flush call stack (holds a reference)
      globalThis.gc!();
      resolve(void 0);
    }, 0),
  );
}

describe("gc", () => {
  if (globalThis.gc) {
    test("should gc computed if there are no observers", async () => {
      const $a = signal(0),
        ref = new WeakRef(computed(() => $a()));

      await gc();
      expect(ref.deref()).toBeUndefined();
    });

    test("should _not_ gc computed if there are observers", async () => {
      const $a = signal(0);
      let pointer;

      const ref = new WeakRef((pointer = computed(() => $a())));

      ref.deref()!();

      await gc();
      expect(ref.deref()).toBeDefined();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      pointer = undefined;
      await gc();
      expect(ref.deref()).toBeUndefined();
    });

    test("should gc root if disposed", async () => {
      const $a = signal(0);
      let ref!: WeakRef<any>;
      let pointer;

      const dispose = root((dispose) => {
        ref = new WeakRef(
          (pointer = computed(() => {
            $a();
          })),
        );

        return dispose;
      });

      await gc();
      expect(ref.deref()).toBeDefined();

      dispose();
      await gc();
      expect(ref.deref()).toBeDefined();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      pointer = undefined;
      await gc();
      expect(ref.deref()).toBeUndefined();
    });

    test("should gc effect lazily", async () => {
      const $a = signal(0);
      let ref!: WeakRef<any>;

      const dispose = root((dispose) => {
        effect(() => {
          $a();
          ref = new WeakRef(getScope()!);
        });

        return dispose;
      });

      await gc();
      expect(ref.deref()).toBeDefined();

      dispose();
      $a.set(1);

      await gc();
      expect(ref.deref()).toBeUndefined();
    });
  } else {
    test("", () => {});
  }
});
