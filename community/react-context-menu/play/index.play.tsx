import { useRef } from "react";
import { ContextMenu, type ContextMenuApi, type ContextMenuItem } from "../src/context-menu";
import { getClientX, getClientY } from "@1771technologies/js-utils";
import { contextMenuAxeDefault } from "../src/context-menu-axe";
import { menuAxeDefault } from "@1771technologies/react-menu-legacy";

export default function Menu() {
  const ref = useRef<ContextMenuApi>(null);
  return (
    <div
      style={{
        width: 400,
        height: 400,
        border: "1px solid black",
        position: "relative",
        top: 20,
        left: 20,
      }}
      onContextMenu={(ev) => {
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
        dialogClassName={css`
          padding: 0;
          border: 0px;
          &::backdrop {
            background-color: transparent;
          }
        `}
        classes={{
          menu: css`
            width: fit-content;
            padding: 2px 0px;
            border: 1px solid grey;
            border-radius: 3px;
          `,
          base: css`
            display: flex;
            align-items: center;
            padding: 4px 8px;

            &:hover {
              background-color: aliceblue;
            }
          `,
          separator: css`
            height: 1px;
            margin: 1px 0px;
            background-color: black;
          `,
        }}
        menuAxe={menuAxeDefault}
      />
    </div>
  );
}

const menuItems: ContextMenuItem[] = [
  { kind: "item", action: () => {}, id: "x", label: "New Tab" },
  { kind: "item", action: () => {}, id: "y", label: "New Window" },
  { kind: "separator" },
  {
    kind: "submenu",
    id: "Favorites",
    label: "Favorites",
    children: [
      { kind: "item", label: "Github", action: () => {}, id: "v" },
      { kind: "item", label: "Radix", action: () => {}, id: "radix" },
      { kind: "item", label: "Twitter", action: () => {}, id: "twitter" },
      {
        kind: "submenu",
        id: "Sub Sub",
        label: "Sub Sub",
        children: [
          { kind: "item", label: "V", id: "VV", action: () => {} },
          { kind: "item", label: "C", id: "CC", action: () => {} },
        ],
      },
    ],
  },
  { kind: "item", action: () => {}, label: "Downloads", id: "downloads" },
  { kind: "separator" },
  {
    kind: "group",
    id: "settings",
    label: "settings",
    children: [
      {
        kind: "checkbox",
        checked: false,
        id: "show-toolbar",
        label: "Show Toolbar",
        onCheckChange: () => {},
        closeOnAction: true,
      },
      {
        kind: "checkbox",
        checked: false,
        id: "show-navbar",
        label: "Show navbar",
        onCheckChange: () => {},
      },
    ],
  },
];
