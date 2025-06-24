import { atom, createStore } from "@1771technologies/atom";
import { describe, expect, test, vi } from "vitest";
import { makeGridAtom } from "../make-grid-atom";
import { renderHook } from "@testing-library/react";
import { act } from "react";

describe("makeGridAtom", () => {
  test("should create the correct type of grid atom", () => {
    const writable = atom(2);
    const readonly = atom((g) => g(writable) * 2);

    const store = createStore();
    const writableGridAtom = makeGridAtom(writable, store);
    const readonlyGridAtom = makeGridAtom(readonly, store);

    const result = renderHook(() => {
      const v = writableGridAtom.useValue();
      const c = readonlyGridAtom.useValue();

      return { v, c };
    });

    expect(result.result).toMatchInlineSnapshot(`
      {
        "current": {
          "c": 4,
          "v": 2,
        },
      }
    `);

    act(() => {
      writableGridAtom.set(3);
    });
    expect(result.result).toMatchInlineSnapshot(`
      {
        "current": {
          "c": 6,
          "v": 3,
        },
      }
    `);

    expect(writableGridAtom.get()).toEqual(3);

    const watchOne = vi.fn();
    const watchTwo = vi.fn();

    writableGridAtom.watch(watchOne);
    readonlyGridAtom.watch(watchTwo);

    act(() => {
      writableGridAtom.set(4);
    });

    expect(watchTwo).toHaveBeenCalledOnce();
    expect(watchOne).toHaveBeenCalledOnce();

    expect(readonlyGridAtom.get()).toEqual(8);
    expect(readonlyGridAtom.set).toBeUndefined();
  });
});
