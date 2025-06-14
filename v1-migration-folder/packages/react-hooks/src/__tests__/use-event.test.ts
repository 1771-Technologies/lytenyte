// @vitest-environment jsdom
import React from "react";
import { useEvent } from "../use-event.js";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook } from "@testing-library/react";

describe(`useEvent (React ${React.version})`, () => {
  const initialCallback = vi.fn((...args) => args);
  let stableCallback: any;
  let rerender: (newCallback?: any) => void;

  function renderTestHook() {
    const result = renderHook(
      (latestCallback) => {
        stableCallback = useEvent(latestCallback);
      },
      { initialProps: initialCallback },
    );
    rerender = result.rerender;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    renderTestHook();
  });

  test("should return a different function", () => {
    expect(typeof stableCallback).toEqual("function");
    expect(stableCallback).not.toBe(initialCallback);
    expect(initialCallback).not.toHaveBeenCalled();
  });

  test("calling the stableCallback should call the initialCallback", () => {
    stableCallback();
    expect(initialCallback).toHaveBeenCalled();
  });

  test("all params and return value should be passed through", () => {
    const returnValue = stableCallback(1, 2, 3);
    expect(initialCallback).toHaveBeenCalledWith(1, 2, 3);
    expect(returnValue).toEqual([1, 2, 3]);
  });

  test('will pass through the current "this" value', () => {
    const thisObj = { stableCallback };
    thisObj.stableCallback(1, 2, 3);
    expect(initialCallback).toHaveBeenCalledTimes(1);
    expect(initialCallback.mock.instances[0]).toBe(thisObj);
  });

  describe("timing", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {
        /* suppress Reacts error logging  */
      });
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });

    test("will throw an error if called during render", () => {
      const useEventBeforeMount = () => {
        const cb = useEvent(() => 5);
        cb();
      };
      expect(() => {
        const r = renderHook(() => useEventBeforeMount());

        // @ts-expect-error This is just for React 17:
        if (r.result.error) throw r.result.error;
      }).toThrowErrorMatchingInlineSnapshot(
        `[Error: INVALID_USEEVENT_INVOCATION: the callback from useEvent cannot be invoked before the component has mounted.]`,
      );
    });

    test("will work fine if called inside a useLayoutEffect", () => {
      const useEventInLayoutEffect = () => {
        const [state, setState] = React.useState(0);
        const cb = useEvent(() => 5);
        React.useLayoutEffect(() => {
          setState(cb());
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        return state;
      };
      const { result } = renderHook(() => useEventInLayoutEffect());
      expect(result).toMatchObject({ current: 5 });
    });

    describe("when used in a NESTED useLayoutEffect", () => {
      const renderNestedTest = () => {
        /**
         * This is a tricky edge-case scenario that happens in React 16/17.
         *
         * We update our callback inside a `useLayoutEffect`.
         * With nested React components, `useLayoutEffect` gets called
         * in children first, parents last.
         *
         * So if we pass a `useEvent` callback into a child component,
         * and the child component calls it in a useLayoutEffect,
         * we will throw an error.
         */

        // Since we're testing this with react-hooks, we need to use a Context to achieve parent-child hierarchy
        const ctx = React.createContext<{ callback(): number }>(null!);
        const wrapper: React.FC<React.PropsWithChildren> = (props) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const callback = useEvent(() => 5);
          return React.createElement(ctx.Provider, { value: { callback } }, props.children);
        };

        const { result } = renderHook(
          () => {
            const [layoutResult, setLayoutResult] = React.useState<any>(null);
            const { callback } = React.useContext(ctx);
            React.useLayoutEffect(() => {
              // Unfortunately, renderHook won't capture a layout error.
              // Instead, we'll manually capture it:
              try {
                setLayoutResult({ callbackResult: callback() });
              } catch (err) {
                setLayoutResult({ layoutError: err });
              }
              // eslint-disable-next-line react-hooks/exhaustive-deps
            }, []);

            return layoutResult;
          },
          { wrapper },
        );

        return result;
      };

      test("will have no problems because of useInjectionEffect", () => {
        const result = renderNestedTest();
        expect(result.current).toMatchInlineSnapshot(`
            {
              "callbackResult": 5,
            }
          `);
      });
    });
  });

  describe("when the hook is rerendered", () => {
    const newCallback = vi.fn();
    let originalStableCallback: typeof stableCallback;
    beforeEach(() => {
      originalStableCallback = stableCallback;
      rerender(newCallback);
    });

    test("the stableCallback is stable", () => {
      expect(stableCallback).toBe(originalStableCallback);
    });

    test("calling the stableCallback only calls the latest callback", () => {
      stableCallback();
      expect(initialCallback).not.toHaveBeenCalled();
      expect(newCallback).toHaveBeenCalled();
    });

    test("the same goes for the 3rd render, etc", () => {
      const thirdCallback = vi.fn();
      rerender(thirdCallback);
      stableCallback();
      expect(initialCallback).not.toHaveBeenCalled();
      expect(newCallback).not.toHaveBeenCalled();
      expect(thirdCallback).toHaveBeenCalled();
    });
  });
});
