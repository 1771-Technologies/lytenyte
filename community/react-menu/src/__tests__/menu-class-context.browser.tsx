import { render } from "@1771technologies/aio/browser";
import { MenuClassProvider, useClasses } from "../menu-class-context";

const X = () => {
  function Y() {
    const c = useClasses();
    return <div>{Object.values(c).join(",")}</div>;
  }

  return (
    <MenuClassProvider value={{ base: "alpha", group: "group" }}>
      <Y />
    </MenuClassProvider>
  );
};

test("should product the correct context", async () => {
  const screen = render(<X />);

  await expect.element(screen.getByText("alpha,group")).toBeVisible();
});
