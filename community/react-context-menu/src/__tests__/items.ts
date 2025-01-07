import type { ContextMenuItem } from "../context-menu";

export const menuItems: ContextMenuItem[] = [
  { kind: "item", action: () => {}, id: "x", label: "New Tab" },
  { kind: "item", action: () => {}, id: "y", label: "New Window", closeOnAction: false },
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
        kind: "radio",
        checked: false,
        id: "show-navbar",
        label: "Show navbar",
        onCheckChange: () => {},
      },

      {
        kind: "checkbox",
        checked: false,
        id: "show-toolbar",
        label: "Show Toolbar",
        onCheckChange: () => {},
        closeOnAction: false,
      },
      {
        kind: "radio",
        checked: false,
        id: "show-navbar",
        label: "Show navbar",
        onCheckChange: () => {},
        closeOnAction: false,
      },
    ],
  },
];
