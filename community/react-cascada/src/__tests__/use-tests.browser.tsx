import { render } from "@1771technologies/aio/browser";
import { cascada, computed, remote, signal } from "../cascada";

test("should correctly be able to use the store", async () => {
  const s = cascada(() => {
    const x = signal(1);
    const y = computed(() => x.get() * 2);
    const z = remote({
      get: () => y.get() * 2,
      set: () => {},
      subscribe: (fn) => y.watch(fn),
    });

    return { x, y, z };
  });

  const F = () => {
    return (
      <div>
        <div>{s.x.use()}</div>
        <div>{s.y.use()}</div>
        <div>{s.z.use()}</div>
      </div>
    );
  };

  const screen = render(<F />);

  await expect.element(screen.getByText("1")).toBeVisible();
  await expect.element(screen.getByText("2")).toBeVisible();
  await expect.element(screen.getByText("4")).toBeVisible();

  s.x.set(10);

  await expect.element(screen.getByText("10")).toBeVisible();
  await expect.element(screen.getByText("20")).toBeVisible();
  await expect.element(screen.getByText("40")).toBeVisible();
});
