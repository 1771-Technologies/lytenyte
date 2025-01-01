import { computed, signal, type Signal } from "@1771technologies/cascada";
import { useCascada } from "../cascada.js";
import { render } from "@1771technologies/aio/browser";
import type { CascadaStore } from "../types.js";

test("should correctly handle signal values", async () => {
  const Component = () => {
    const s = useCascada(() => {
      const count = signal(0);

      return { count };
    });

    const count = s.useValue("count");

    return (
      <div>
        <button onClick={() => s.store.count.set((prev) => prev + 1)}>Increment</button>
        <div>Value: {count}</div>
      </div>
    );
  };

  const screen = render(<Component />);

  const button = screen.getByRole("button");
  const text = screen.getByText("Value: 0");

  await expect.element(button).toBeVisible();
  await expect.element(text).toBeVisible();

  await button.click();
  await button.click();

  await expect.element(screen.getByText("Value: 2")).toBeVisible();
});

test("should correctly handle computed signal values", async () => {
  const Component = () => {
    const s = useCascada(() => {
      const count = signal(0);
      const doubleCount = computed(() => count.get() * 2);

      return {
        count,
        doubleCount,
      };
    });

    const count = s.useValue("count");
    const double = s.useValue("doubleCount");

    return (
      <div>
        <button onClick={() => s.store.count.set(11)}>Increment</button>

        <div>
          Double is {double} and count is {count}
        </div>
      </div>
    );
  };

  const screen = render(<Component />);

  const button = screen.getByRole("button");

  await expect.element(screen.getByText("Double is 0 and count is 0")).toBeVisible();

  await button.click();
  await expect.element(screen.getByText("Double is 22 and count is 11")).toBeVisible();
});

test("should handle selector correctly", async () => {
  const Component = () => {
    const s = useCascada(() => {
      const count = signal(0);

      return {
        count,
      };
    });

    const count = s.useValue("count");
    const double = s.useSelector((v) => v.count.get() * 2);

    return (
      <div>
        <button onClick={() => s.store.count.set(11)}>Increment</button>

        <div>
          Double is {double} and count is {count}
        </div>
      </div>
    );
  };

  const screen = render(<Component />);

  const button = screen.getByRole("button");

  await expect.element(screen.getByText("Double is 0 and count is 0")).toBeVisible();

  await button.click();
  await expect.element(screen.getByText("Double is 22 and count is 11")).toBeVisible();

  // Will call dispose. If it doesn't the coverage will not how the lines as covered.
  screen.unmount();
});

test("should only renderer at the correct level", async () => {
  type Store = CascadaStore<{ count: Signal<number> }>;

  const fn = vi.fn();
  const childFn = vi.fn();

  const Child = (p: { s: Store }) => {
    childFn();
    return <div>Count is: {p.s.useValue("count")}</div>;
  };
  const Component = () => {
    fn();
    const s = useCascada(() => {
      const count = signal(0);

      return {
        count,
      };
    });

    return (
      <div>
        <button onClick={() => s.store.count.set(11)}>Increment</button>

        <Child s={s} />
      </div>
    );
  };

  const screen = render(<Component />);

  expect(childFn).toHaveBeenCalledOnce();
  expect(fn).toHaveBeenCalledOnce();

  const button = screen.getByRole("button");
  await button.click();

  expect(childFn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenCalledOnce();
});
