import { render } from "@1771technologies/aio/browser";
import { MenuStateProvider, useMenuState } from "../menu-state-context";

const X = () => {
  function Z() {
    const s = useMenuState();

    return <div>{s}</div>;
  }

  return (
    <MenuStateProvider value={"kong"}>
      <Z />
    </MenuStateProvider>
  );
};

test("should produce the correct context", async () => {
  const screen = render(<X />);

  await expect.element(screen.getByText("kong")).toBeVisible();
});
