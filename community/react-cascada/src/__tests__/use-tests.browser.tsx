import { render } from "@1771technologies/aio/browser";
import { cascada, computed, signal } from "../cascada";

test("should correctly be able to use the store", async () => {
  const s = cascada(() => {
    const x = signal(1);
    const y = computed(() => x.get() * 2);

    return { x, y };
  });

  const F = () => {
    return (
      <div>
        <div>{s.x.use()}</div>
        <div>{s.y.use()}</div>
      </div>
    );
  };

  const screen = render(<F />);

  await expect.element(screen.getByText("1")).toBeVisible();
  await expect.element(screen.getByText("2")).toBeVisible();

  s.x.set(10);

  await expect.element(screen.getByText("10")).toBeVisible();
  await expect.element(screen.getByText("20")).toBeVisible();
});
