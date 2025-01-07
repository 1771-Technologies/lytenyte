import type { MenuItemCheckbox, MenuItemGroup } from "@1771technologies/react-menu";
import { processMenuItems } from "../process-menu-items";
import { menuItems } from "./items";

test("should process the menu items correctly", () => {
  const close = vi.fn();
  const items = processMenuItems(menuItems, close);

  ((items.at(6) as MenuItemGroup).children[1] as MenuItemCheckbox).onCheckChange({} as any);
  ((items.at(6) as MenuItemGroup).children[0] as MenuItemCheckbox).onCheckChange({} as any);
});
