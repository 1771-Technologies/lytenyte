import { describe, expect, test, vi } from "vitest";
import { root, tick } from "../primitives.js";
import { selector } from "../selector.js";
import { signal, computed } from "../signal.js";

describe("selector", () => {
  test("should observe key changes", () => {
    root((dispose) => {
      const $source = signal(0);
      const $selector = selector($source);
      // Creating multiple selectors with the same key will should not duplicate the fn callback
      const effect0 = vi.fn($selector(0));
      const effect0a = vi.fn($selector(0));

      const effect1 = vi.fn($selector(1));
      const effect2 = vi.fn($selector(2));

      const $effect0 = computed(effect0);
      const $effect0a = computed(effect0a);
      const $effect1 = computed(effect1);
      const $effect2 = computed(effect2);

      expect($effect0()).toBe(true);
      expect($effect0a()).toBe(true);
      expect($effect1()).toBe(false);
      expect($effect2()).toBe(false);

      expect(effect0).toHaveBeenCalledTimes(1);
      expect(effect0a).toHaveBeenCalledTimes(1);
      expect(effect1).toHaveBeenCalledTimes(1);
      expect(effect2).toHaveBeenCalledTimes(1);

      $source.set(1);
      tick();

      expect($effect0()).toBe(false);
      expect($effect1()).toBe(true);
      expect($effect2()).toBe(false);

      expect(effect0).toHaveBeenCalledTimes(2);
      expect(effect1).toHaveBeenCalledTimes(2);
      expect(effect2).toHaveBeenCalledTimes(1);

      $source.set(2);
      tick();

      expect($effect0()).toBe(false);
      expect($effect1()).toBe(false);
      expect($effect2()).toBe(true);

      expect(effect0).toHaveBeenCalledTimes(2);
      expect(effect1).toHaveBeenCalledTimes(3);
      expect(effect2).toHaveBeenCalledTimes(2);

      $source.set(-1);
      tick();

      expect($effect0()).toBe(false);
      expect($effect1()).toBe(false);
      expect($effect2()).toBe(false);

      expect(effect0).toHaveBeenCalledTimes(2);
      expect(effect1).toHaveBeenCalledTimes(3);
      expect(effect2).toHaveBeenCalledTimes(3);

      dispose();

      $source.set(0);
      tick();
      $source.set(1);
      tick();
      $source.set(2);
      tick();

      expect($effect0()).toBe(false);
      expect($effect1()).toBe(false);
      expect($effect2()).toBe(false);

      expect(effect0).toHaveBeenCalledTimes(2);
      expect(effect1).toHaveBeenCalledTimes(3);
      expect(effect2).toHaveBeenCalledTimes(3);
    });
  });
});
