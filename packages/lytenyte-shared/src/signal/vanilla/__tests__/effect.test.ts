import { afterEach, describe, expect, test, vi } from "vitest";
import { onDispose, tick } from "../primitives.js";
import { signal, effect, computed } from "../signal.js";

describe("effect", () => {
  afterEach(() => tick());

  test("should run effect", () => {
    const $a = signal(0),
      $effect = vi.fn(() => void $a());

    effect($effect);
    expect($effect).toHaveBeenCalledTimes(1);

    $a.set(1);
    tick();
    expect($effect).toHaveBeenCalledTimes(2);
  });

  test("should run effect on change", () => {
    const effectA = vi.fn();

    const $a = signal(10);
    const $b = signal(10);
    const $c = computed(() => $a() + $b());
    const $d = computed(() => $c());

    effect(() => {
      effectA();
      $d();
    });

    expect(effectA).to.toHaveBeenCalledTimes(1);

    $a.set(20);
    tick();
    expect(effectA).to.toHaveBeenCalledTimes(2);

    $b.set(20);
    tick();
    expect(effectA).to.toHaveBeenCalledTimes(3);

    $a.set(20);
    $b.set(20);
    tick();
    expect(effectA).to.toHaveBeenCalledTimes(3);
  });

  test("should handle nested effect", () => {
    const $a = signal(0);
    const $b = signal(0);

    const outerEffect = vi.fn();
    const innerEffect = vi.fn();
    const innerDispose = vi.fn();

    const stop = effect(() => {
      $a();
      outerEffect();
      effect(() => {
        $b();
        innerEffect();
        onDispose(innerDispose);
      });
    });

    expect(outerEffect).toHaveBeenCalledTimes(1);
    expect(innerEffect).toHaveBeenCalledTimes(1);
    expect(innerDispose).toHaveBeenCalledTimes(0);

    $b.set(1);
    tick();
    expect(outerEffect).toHaveBeenCalledTimes(1);
    expect(innerEffect).toHaveBeenCalledTimes(2);
    expect(innerDispose).toHaveBeenCalledTimes(1);

    $b.set(2);
    tick();
    expect(outerEffect).toHaveBeenCalledTimes(1);
    expect(innerEffect).toHaveBeenCalledTimes(3);
    expect(innerDispose).toHaveBeenCalledTimes(2);

    innerEffect.mockReset();
    innerDispose.mockReset();

    $a.set(1);
    tick();
    expect(outerEffect).toHaveBeenCalledTimes(2);
    expect(innerEffect).toHaveBeenCalledTimes(1); // new one is created
    expect(innerDispose).toHaveBeenCalledTimes(1);

    $b.set(3);
    tick();
    expect(outerEffect).toHaveBeenCalledTimes(2);
    expect(innerEffect).toHaveBeenCalledTimes(2);
    expect(innerDispose).toHaveBeenCalledTimes(2);

    stop();
    $a.set(10);
    $b.set(10);
    expect(outerEffect).toHaveBeenCalledTimes(2);
    expect(innerEffect).toHaveBeenCalledTimes(2);
    expect(innerDispose).toHaveBeenCalledTimes(3);
  });

  test("should stop effect", () => {
    const effectA = vi.fn();

    const $a = signal(10);

    const stop = effect(() => {
      effectA();
      $a();
    });

    stop();

    $a.set(20);
    tick();
    expect(effectA).toHaveBeenCalledTimes(1);
  });

  test("should call returned dispose function", () => {
    const dispose = vi.fn();

    const $a = signal(0);

    effect(() => {
      $a();
      return dispose;
    });

    expect(dispose).toHaveBeenCalledTimes(0);

    for (let i = 1; i <= 3; i += 1) {
      $a.set(i);
      tick();
      expect(dispose).toHaveBeenCalledTimes(i);
    }
  });

  test("should run all disposals before each new run", () => {
    const effectA = vi.fn();
    const disposeA = vi.fn();
    const disposeB = vi.fn();

    function fnA() {
      onDispose(disposeA);
    }

    function fnB() {
      onDispose(disposeB);
    }

    const $a = signal(0);
    effect(() => {
      effectA();
      void (fnA(), fnB(), $a());
    });

    expect(effectA).toHaveBeenCalledTimes(1);
    expect(disposeA).toHaveBeenCalledTimes(0);
    expect(disposeB).toHaveBeenCalledTimes(0);

    for (let i = 1; i <= 3; i += 1) {
      $a.set(i);
      tick();
      expect(effectA).toHaveBeenCalledTimes(i + 1);
      expect(disposeA).toHaveBeenCalledTimes(i);
      expect(disposeB).toHaveBeenCalledTimes(i);
    }
  });

  test("should dispose of nested effect", () => {
    const $a = signal(0);
    const innerEffect = vi.fn();

    const stop = effect(() => {
      effect(() => {
        innerEffect($a());
      });
    });

    stop();

    $a.set(10);
    tick();
    expect(innerEffect).toHaveBeenCalledTimes(1);
    expect(innerEffect).not.toHaveBeenCalledWith(10);
  });

  test("should conditionally observe", () => {
    const $a = signal(0);
    const $b = signal(0);
    const $cond = signal(true);
    const $c = computed(() => ($cond() ? $a() : $b()));
    const $effect = vi.fn();

    effect(() => {
      $c();
      $effect();
    });

    expect($effect).toHaveBeenCalledTimes(1);

    $b.set(1);
    tick();
    expect($effect).toHaveBeenCalledTimes(1);

    $a.set(1);
    tick();
    expect($effect).toHaveBeenCalledTimes(2);

    $cond.set(false);
    tick();
    expect($effect).toHaveBeenCalledTimes(2);

    $b.set(2);
    tick();
    expect($effect).toHaveBeenCalledTimes(3);

    $a.set(3);
    tick();
    expect($effect).toHaveBeenCalledTimes(3);
  });

  test("should dispose of nested conditional effect", () => {
    const $cond = signal(true);

    const disposeA = vi.fn();
    const disposeB = vi.fn();

    function fnA() {
      effect(() => {
        onDispose(disposeA);
      });
    }

    function fnB() {
      effect(() => {
        onDispose(disposeB);
      });
    }

    effect(() => ($cond() ? fnA() : fnB()));

    $cond.set(false);
    tick();
    expect(disposeA).toHaveBeenCalledTimes(1);
  });

  // https://github.com/preactjs/signals/issues/152
  test("should handle looped effects", () => {
    let values: number[] = [],
      loop = 2;

    const $value = signal(0);

    effect(() => {
      values.push($value());
      for (let i = 0; i < loop; i++) {
        effect(() => {
          values.push($value() + i);
        });
      }
    });

    tick();

    expect(values).toHaveLength(3);
    expect(values.join(",")).toBe("0,0,1");

    loop = 1;
    values = [];
    $value.set(1);
    tick();

    expect(values).toHaveLength(2);
    expect(values.join(",")).toBe("1,1");

    values = [];
    $value.set(2);
    tick();

    expect(values).toHaveLength(2);
    expect(values.join(",")).toBe("2,2");
  });

  test("should apply changes in effect in same flush", async () => {
    const $a = signal(0),
      $b = signal(0),
      $c = computed(() => {
        return $a() + 1;
      }),
      $d = computed(() => {
        return $c() + 2;
      });

    effect(() => {
      $a.set((n) => n + 1);
      $b();
    });

    expect($a()).toBe(1);
    expect($d()).toBe(4);
    expect($c()).toBe(2);

    $b.set(1);

    await Promise.resolve();

    expect($a()).toBe(2);
    expect($d()).toBe(5);
    expect($c()).toBe(3);

    $b.set(2);

    await Promise.resolve();

    expect($a()).toBe(3);
    expect($d()).toBe(6);
    expect($c()).toBe(4);
  });

  test("runs parent effects before child effects", () => {
    const $a = signal(0);
    const $b = computed(() => $a());

    let calls = 0;
    effect(() => {
      effect(() => {
        void $a();
        calls++;
      });

      $b();
    });

    $a.set(1);
    tick();
    expect(calls).toBe(2);
  });
});
