import { describe, expect, test, vi } from "vitest";
import { root, onError, tick } from "../primitives.js";
import { effect, signal } from "../signal.js";

describe("onError", () => {
  test("should let errors should bubble up when not handled", () => {
    const error = new Error();
    expect(() => {
      root(() => {
        effect(() => {
          throw error;
        });
      });
    }).toThrowError(error);
  });

  test("should handle error", () => {
    const error = new Error(),
      handler = vi.fn();

    root(() => {
      effect(() => {
        onError(handler);
        throw error;
      });
    });

    expect(handler).toHaveBeenCalledWith(error);
  });

  test("should throw error if there are no handlers left", () => {
    const error = new Error(),
      handler = vi.fn((error) => {
        throw error;
      });

    expect(() => {
      effect(() => {
        onError(handler);
        throw error;
      });
    }).toThrow(error);

    expect(handler).toHaveBeenCalledWith(error);
  });

  test("calling on error when there this no scope defined should just return", () => {
    const fn = vi.fn();
    onError(fn);
  });

  test("should forward error to another handler", () => {
    const error = new Error(),
      handler = vi.fn();

    const $a = signal(0);

    root(() => {
      effect(() => {
        onError(handler);

        effect(() => {
          $a();

          onError((error) => {
            throw error;
          });

          throw error;
        });
      });
    });

    expect(handler).toHaveBeenCalledWith(error);
    expect(handler).toHaveBeenCalledTimes(1);

    $a.set(1);
    tick();
    expect(handler).toHaveBeenCalledTimes(2);
  });

  test("should not duplicate error handler", () => {
    const error = new Error(),
      handler = vi.fn();

    const $a = signal(0);
    let shouldThrow = false;

    root(() => {
      effect(() => {
        $a();
        onError(() => handler());
        if (shouldThrow) throw error;
      });
    });

    $a.set(1);
    tick();

    shouldThrow = true;
    $a.set(2);
    tick();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("should not trigger wrong handler", () => {
    const error = new Error(),
      rootHandler = vi.fn(),
      handler = vi.fn();

    const $a = signal(0);
    let shouldThrow = false;

    root(() => {
      onError(rootHandler);

      effect(() => {
        $a();
        if (shouldThrow) throw error;
      });

      effect(() => {
        onError(handler);
      });
    });

    shouldThrow = true;
    $a.set(1);
    tick();

    expect(rootHandler).toHaveBeenCalledWith(error);
    expect(handler).not.toHaveBeenCalledWith(error);
  });

  test("should not coerce error", () => {
    const error = 10,
      handler = vi.fn();

    root(() => {
      effect(() => {
        onError(handler);
        throw error;
      });
    });

    expect(handler).toHaveBeenCalledWith(error);
  });
});
