import { MenuRoot, type MenuItem } from "../src/menu-root";

const menuItems: MenuItem[] = [
  { kind: "item", action: () => {}, id: "x", label: "New Tab" },
  { kind: "item", action: () => {}, id: "y", label: "New Window" },
  { kind: "separator" },
  {
    kind: "submenu",
    id: "z",
    label: "Favorites",
    children: [
      { kind: "item", label: "Github", action: () => {}, id: "v" },
      { kind: "item", label: "Radix", action: () => {}, id: "radix" },
      { kind: "item", label: "Twitter", action: () => {}, id: "twitter" },
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
        id: "show-toolbar",
        label: "Show Toolbar",
        onCheckChange: () => {},
      },
    ],
  },
];
export default function MenuPlay() {
  return (
    <div>
      <button id="me">Menu</button>
      <MenuRoot
        ariaLabelledBy="me"
        menuItems={menuItems}
        state={{}}
        classes={{
          menu: css`
            width: fit-content;
            padding: 2px;
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
    </div>
  );
}
