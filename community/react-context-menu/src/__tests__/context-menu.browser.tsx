import { menuAxeDefault } from "@1771technologies/react-menu-legacy";
import { contextMenuAxeDefault } from "../context-menu-axe";
import { ContextMenu, type ContextMenuApi } from "../context-menu";
import { getClientX, getClientY } from "@1771technologies/js-utils";
import { useRef } from "react";
import { render } from "@1771technologies/aio/browser";
import { menuItems } from "./items";

test("should render and work", async () => {
  const screen = render(<X />);

  const c = screen.getByTestId("context-menu");

  await c.click();

  const item = screen.getByText("New Tab");
  await expect.element(item).toBeVisible();

  await item.click();
});

function X() {
  const ref = useRef<ContextMenuApi>(null);
  return (
    <div
      data-testid="context-menu"
      style={{
        width: 400,
        height: 400,
        border: "1px solid black",
        position: "relative",
        top: 20,
        left: 20,
      }}
      onClick={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        const clientX = getClientX(ev.nativeEvent);
        const clientY = getClientY(ev.nativeEvent);

        ref.current?.show({ position: { x: clientX, y: clientY }, menuItems, state: {} });
      }}
    >
      <ContextMenu
        ref={ref}
        axe={contextMenuAxeDefault}
        menuAxe={menuAxeDefault}
        classes={{ base: "" }}
      />
    </div>
  );
}
