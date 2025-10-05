// https://github.com/preactjs/signals/blob/main/packages/core/test/signal.test.tsx#L1249

import { describe, expect, test, vi } from "vitest";
import { computed, signal } from "../signal.js";
import { tick } from "../primitives.js";

describe("graph", () => {
  test("should drop A->B->A updates", () => {
    //     A
    //   / |
    //  B  | <- Looks like a flag doesn't it? :D
    //   \ |
    //     C
    //     |
    //     D

    const $a = signal(2);
    const $b = computed(() => $a() - 1);
    const $c = computed(() => $a() + $b());

    const compute = vi.fn(() => "d: " + $c());
    const $d = computed(compute);

    expect($d()).toBe("d: 3");
    expect(compute).toHaveBeenCalledTimes(1);
    compute.mockReset();

    $a.set(4);
    $d();
    tick();
    expect(compute).toHaveBeenCalledTimes(1);
  });

  test("should only update every signal once (diamond graph)", () => {
    // In this scenario "D" should only update once when "A" receives
    // an update. This is sometimes referred to as the "diamond" scenario.
    //     A
    //   /   \
    //  B     C
    //   \   /
    //     D

    const $a = signal("a");
    const $b = computed(() => $a());
    const $c = computed(() => $a());

    const spy = vi.fn(() => $b() + " " + $c());
    const $d = computed(spy);

    expect($d()).toBe("a a");
    expect(spy).toHaveBeenCalledTimes(1);

    $a.set("aa");
    tick();
    expect($d()).toBe("aa aa");
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test("should only update every signal once (diamond graph + tail)", () => {
    // "E" will be likely updated twice if our mark+sweep logic is buggy.
    //     A
    //   /   \
    //  B     C
    //   \   /
    //     D
    //     |
    //     E

    const $a = signal("a");
    const $b = computed(() => $a());
    const $c = computed(() => $a());
    const $d = computed(() => $b() + " " + $c());

    const spy = vi.fn(() => $d());
    const $e = computed(spy);

    expect($e()).toBe("a a");
    expect(spy).toHaveBeenCalledTimes(1);

    $a.set("aa");
    tick();
    expect($e()).toBe("aa aa");
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test("should bail out if result is the same", () => {
    // Bail out if value of "B" never changes
    // A->B->C

    const $a = signal("a");

    const $b = computed(() => {
      $a();
      return "foo";
    });

    const spy = vi.fn(() => $b());
    const $c = computed(spy);

    expect($c()).toBe("foo");
    expect(spy).toHaveBeenCalledTimes(1);

    $a.set("aa");
    tick();
    expect($c()).toBe("foo");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("should only update every signal once (jagged diamond graph + tails)", () => {
    // "F" and "G" will be likely updated >3 if our mark+sweep logic is buggy.
    //     A
    //   /   \
    //  B     C
    //  |     |
    //  |     D
    //   \   /
    //     E
    //   /   \
    //  F     G

    const $a = signal("a", { id: "$a" });
    const $b = computed(() => $a(), { id: "$b" });
    const $c = computed(() => $a(), { id: "$c" });
    const $d = computed(() => $c(), { id: "$d" });

    const eSpy = vi.fn(() => $b() + " " + $d());
    const $e = computed(eSpy, { id: "$e" });

    const fSpy = vi.fn(() => $e());
    const $f = computed(fSpy, { id: "$f" });
    const gSpy = vi.fn(() => $e());
    const $g = computed(gSpy, { id: "$g" });

    expect($f()).toBe("a a");
    expect(fSpy).toHaveBeenCalledTimes(1);

    expect($g()).toBe("a a");
    expect(gSpy).toHaveBeenCalledTimes(1);

    $a.set("b");
    tick();

    expect($e()).toBe("b b");
    expect(eSpy).toHaveBeenCalledTimes(2);

    expect($f()).toBe("b b");
    expect(fSpy).toHaveBeenCalledTimes(2);

    expect($g()).toBe("b b");
    expect(gSpy).toHaveBeenCalledTimes(2);

    $a.set("c");
    tick();

    expect($e()).toBe("c c");
    expect(eSpy).toHaveBeenCalledTimes(3);

    expect($f()).toBe("c c");
    expect(fSpy).toHaveBeenCalledTimes(3);

    expect($g()).toBe("c c");
    expect(gSpy).toHaveBeenCalledTimes(3);
  });

  test("should only subscribe to signals listened to", () => {
    //    *A
    //   /   \
    // *B     C <- we don't listen to C

    const $a = signal("a");

    const $b = computed(() => $a());
    const spy = vi.fn(() => $a());
    computed(spy);

    expect($b()).toBe("a");
    expect(spy).toBeCalledTimes(0);

    $a.set("aa");
    tick();

    expect($b()).toBe("aa");
    expect(spy).toBeCalledTimes(0);
  });

  test("should ensure subs update even if one dep unmarks it", () => {
    // In this scenario "C" always returns the same value. When "A"
    // changes, "B" will update, then "C" at which point its update
    // to "D" will be unmarked. But "D" must still update because
    // "B" marked it. If "D" isn't updated, then we have a bug.
    //     A
    //   /   \
    //  B     *C <- returns same value every time
    //   \   /
    //     D

    const $a = signal("a");
    const $b = computed(() => $a());
    const $c = computed(() => {
      $a();
      return "c";
    });

    const spy = vi.fn(() => $b() + " " + $c());
    const $d = computed(spy);

    expect($d()).toBe("a c");

    $a.set("aa");
    tick();

    expect($d()).toBe("aa c");
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test("should ensure subs update even if two deps unmark it", () => {
    // In this scenario both "C" and "D" always return the same
    // value. But "E" must still update because "A"  marked it.
    // If "E" isn't updated, then we have a bug.
    //     A
    //   / | \
    //  B *C *D
    //   \ | /
    //     E

    const $a = signal("a");
    const $b = computed(() => $a());
    const $c = computed(() => {
      $a();
      return "c";
    });
    const $d = computed(() => {
      $a();
      return "d";
    });

    const spy = vi.fn(() => $b() + " " + $c() + " " + $d());
    const $e = computed(spy);
    expect($e()).toBe("a c d");

    $a.set("aa");
    tick();

    expect($e()).toBe("aa c d");
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
