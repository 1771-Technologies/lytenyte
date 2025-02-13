import { menuAxeDefault } from "../src/menu-axe";
import { MenuRoot, type MenuItem } from "../src/menu-root";
import { useRef, useState } from "react";
import { Popover } from "@1771technologies/react-popover";

const menuItems: MenuItem[] = [
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
export default function MenuPlay() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);
  return (
    <div>
      <button onClick={() => setOpen((prev) => !prev)} ref={ref} id="me">
        Menu
      </button>
      {ref.current && (
        <Popover
          open={open}
          onOpenChange={setOpen}
          popoverTarget={ref.current}
          placement="bottom"
          className={css`
            padding: 0px;
            border: none;
            &::backdrop {
              background-color: transparent;
            }
          `}
        >
          <MenuRoot
            ariaLabelledBy="me"
            axe={menuAxeDefault}
            menuItems={menuItems}
            state={{}}
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
              `,
              separator: css`
                height: 1px;
                margin: 1px 0px;
                background-color: black;
              `,
            }}
          />
        </Popover>
      )}
    </div>
  );
}
