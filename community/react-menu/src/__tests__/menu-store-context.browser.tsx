import { render } from "@1771technologies/aio/browser";
import { MenuStoreProvider, useMenuStore } from "../menu-store-context";

const X = () => {
  function Z() {
    const s = useMenuStore();

    const v = s.useValue("activeId");

    return (
      <div>
        {v ?? "bob"}
        <button onClick={() => s.store.setActiveId.peek()("x")}></button>
      </div>
    );
  }

  return (
    <MenuStoreProvider>
      <Z />
    </MenuStoreProvider>
  );
};

test("should produce the correct context", async () => {
  const screen = render(<X />);

  await expect.element(screen.getByText("bob")).toBeVisible();

  await screen.getByRole("button").click();
  await screen.getByRole("button").click();

  await expect.element(screen.getByText("x")).toBeVisible();
});
