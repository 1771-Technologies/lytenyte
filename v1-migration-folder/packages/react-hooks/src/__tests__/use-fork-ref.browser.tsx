import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { useForkRef } from "../use-fork-ref.js";

describe("useForkRef", () => {
  test("should correctly merge refs", async () => {
    const fn = vi.fn();
    const fn2 = vi.fn();
    const Comp = () => {
      const ref = useForkRef(fn, fn2, null);
      return <div ref={ref}>Lee</div>;
    };

    const screen = render(<Comp />);

    await expect.element(screen.getByText("Lee")).toBeVisible();

    expect(fn).toHaveBeenCalledOnce();
    expect(fn2).toHaveBeenCalledOnce();
  });

  test("supports only function refs", () => {
    const fn = vi.fn();
    const Comp = () => {
      const ref = useForkRef(fn);
      return <div ref={ref}>Function Ref</div>;
    };

    const screen = render(<Comp />);
    expect(fn).toHaveBeenCalledOnce();
    expect(screen.getByText("Function Ref")).toBeDefined();
  });

  test("updates object ref on unmount", async () => {
    const objRef = { current: null } as unknown as React.RefObject<HTMLDivElement>;

    const Comp = ({ show }: { show: boolean }) => {
      const ref = useForkRef(objRef);
      return show ? <div ref={ref}>Unmount Test</div> : null;
    };

    const screen = render(<Comp show={true} />);
    expect(objRef.current).not.toBe(null);

    screen.rerender(<Comp show={false} />);
    expect(objRef.current).toBe(null);
  });

  test("skips when all refs are undefined", () => {
    const Comp = () => {
      const ref = useForkRef(undefined, undefined);
      return <div ref={ref}>No Refs</div>;
    };

    const screen = render(<Comp />);
    const element = screen.getByText("No Refs");
    expect(element).toBeDefined(); // Should still render normally
  });
});
