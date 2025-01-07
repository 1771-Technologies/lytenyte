import type { MenuItemGroup, MenuParent } from "@1771technologies/react-menu";
import type { ContextMenuCheckbox, ContextMenuItem, ContextMenuItemRadio } from "./context-menu";

export function processMenuItems(items: ContextMenuItem[], close: () => void) {
  function handleItems(c: ContextMenuItem): ContextMenuItem {
    if (c.kind === "separator") return c;
    if (c.kind === "checkbox") {
      if (c.closeOnAction === false) return c;

      return {
        ...c,
        onCheckChange: (s) => {
          c.onCheckChange(s);
          close();
        },
      } satisfies ContextMenuCheckbox;
    }

    if (c.kind === "radio") {
      if (c.closeOnAction === false) return c;

      return {
        ...c,
        onCheckChange: (s) => {
          c.onCheckChange(s);
          close();
        },
      } satisfies ContextMenuItemRadio;
    }

    if (c.kind === "group") {
      return { ...c, children: c.children.map(handleItems) } satisfies MenuItemGroup;
    }
    if (c.kind === "submenu") {
      return { ...c, children: c.children.map(handleItems) } satisfies MenuParent;
    }

    if (c.closeOnAction === false) return c;
    return {
      ...c,
      action: (s) => {
        c.action(s);
        close();
      },
    } satisfies ContextMenuItem;
  }

  return items.map(handleItems);
}
