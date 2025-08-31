import { afterEach, describe, expect, test, vi } from "vitest";
import { computed, effect, signal } from "../signal.js";
import { onError, root, tick } from "../primitives.js";

afterEach(() => tick());

describe("computed", () => {
  test("should store and return value on read", () => {
    const $a = signal(10);
    const $b = signal(10);
    const $c = computed(() => $a() + $b());

    expect($c()).toBe(20);
    tick();

    // Try again to ensure state is maintained.
    expect($c()).toBe(20);
  });

  test("should update when dependency is updated", () => {
    const $a = signal(10);
    const $b = signal(10);
    const $c = computed(() => $a() + $b());

    $a.set(20);
    expect($c()).toBe(30);

    $b.set(20);
    expect($c()).toBe(40);
  });

  test("should update when deep dependency is updated", () => {
    const $a = signal(10);
    const $b = signal(10);
    const $c = computed(() => $a() + $b());
    const $d = computed(() => $c());

    $a.set(20);
    expect($d()).toBe(30);
  });

  test("should update when deep computed dependency is updated", () => {
    const $a = signal(10);
    const $b = signal(10);
    const $c = computed(() => $a() + $b());
    const $d = computed(() => $c());
    const $e = computed(() => $d());

    $a.set(20);
    expect($e()).toBe(30);
  });

  test("should only re-compute when needed", () => {
    const compute = vi.fn();

    const $a = signal(10);
    const $b = signal(10);
    const $c = computed(() => compute($a() + $b()));

    expect(compute).not.toHaveBeenCalled();

    $c();
    expect(compute).toHaveBeenCalledTimes(1);
    expect(compute).toHaveBeenCalledWith(20);

    $c();
    expect(compute).toHaveBeenCalledTimes(1);

    $a.set(20);
    $c();
    expect(compute).toHaveBeenCalledTimes(2);

    $b.set(20);
    $c();
    expect(compute).toHaveBeenCalledTimes(3);

    $c();
    expect(compute).toHaveBeenCalledTimes(3);
  });

  test("should only re-compute whats needed", () => {
    const computeC = vi.fn();
    const computeD = vi.fn();

    const $a = signal(10);
    const $b = signal(10);
    const $c = computed(() => {
      const a = $a();
      computeC(a);
      return a;
    });
    const $d = computed(() => {
      const b = $b();
      computeD(b);
      return b;
    });
    const $e = computed(() => $c() + $d());

    expect(computeC).not.toHaveBeenCalled();
    expect(computeD).not.toHaveBeenCalled();

    $e();
    expect(computeC).toHaveBeenCalledTimes(1);
    expect(computeD).toHaveBeenCalledTimes(1);
    expect($e()).toBe(20);

    $a.set(20);
    tick();

    $e();
    expect(computeC).toHaveBeenCalledTimes(2);
    expect(computeD).toHaveBeenCalledTimes(1);
    expect($e()).toBe(30);

    $b.set(20);
    tick();

    $e();
    expect(computeC).toHaveBeenCalledTimes(2);
    expect(computeD).toHaveBeenCalledTimes(2);
    expect($e()).toBe(40);
  });

  test("should discover new dependencies", () => {
    const $a = signal(1);
    const $b = signal(0);

    const $c = computed(() => {
      if ($a()) {
        return $a();
      } else {
        return $b();
      }
    });

    expect($c()).toBe(1);

    $a.set(0);
    tick();
    expect($c()).toBe(0);

    $b.set(10);
    tick();
    expect($c()).toBe(10);
  });

  test("should accept dirty option", () => {
    const $a = signal(0);

    const $b = computed(() => $a(), {
      // Skip odd numbers.
      dirty: (prev, next) => prev + 1 !== next,
    });

    const effectA = vi.fn();
    effect(() => {
      $b();
      effectA();
    });

    expect($b()).toBe(0);
    expect(effectA).toHaveBeenCalledTimes(1);

    $a.set(2);
    tick();
    expect($b()).toBe(2);
    expect(effectA).toHaveBeenCalledTimes(2);

    // no-change
    $a.set(3);
    tick();
    expect($b()).toBe(2);
    expect(effectA).toHaveBeenCalledTimes(2);
  });

  test("should use fallback if error is thrown during init", () => {
    root(() => {
      onError(() => {});

      const $a = computed(
        () => {
          // eslint-disable-next-line no-constant-condition
          if (1) throw Error();
          return "";
        },
        { initial: "foo" },
      );

      expect($a()).toBe("foo");
    });
  });
});
