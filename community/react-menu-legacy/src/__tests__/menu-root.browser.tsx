import { page, render, userEvent } from "@1771technologies/aio/browser";
import { menuAxeDefault } from "../menu-axe";
import { MenuRoot, type MenuItem } from "../menu-root";

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
      {
        kind: "item",
        label: "Twitter",
        action: () => {},
        id: "twitter",
        axe: { axeDescription: "Run", axeLabel: "abc" },
      },
      {
        kind: "submenu",
        id: "Sub Sub",
        label: "Sub Sub",
        style: { display: "block" },
        children: [
          { kind: "item", label: "Victor", id: "VV", action: () => {} },
          { kind: "item", label: "C", id: "CC", action: () => {} },
        ],
      },
    ],
  },
  { kind: "radio", checked: false, onCheckChange: () => {}, label: "Bob", id: "bob" },
  { kind: "radio", checked: true, onCheckChange: () => {}, label: "Bob2", id: "bob1" },
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

const F = () => {
  return (
    <div>
      <MenuRoot
        menuItems={menuItems}
        ariaLabelledBy=""
        axe={menuAxeDefault}
        classes={{ base: "" }}
        state={{}}
      ></MenuRoot>
    </div>
  );
};

test("menu should produce the correct result", async () => {
  const screen = render(<F />);

  const favorites = screen.getByText("Favorites");

  await favorites.hover();
  await favorites.hover();

  await expect.element(screen.getByText("Github")).toBeVisible();

  await screen.getByText("New Tab").hover();
  await screen.getByText("New Tab").hover();

  const el = screen.getByRole("menu").all()[0];
  (el.element() as HTMLElement).focus();

  await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{ArrowRight}");

  await expect.element(screen.getByText("Github")).toBeVisible();

  await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowRight}");

  await userEvent.keyboard("{ArrowLeft}{ArrowLeft}{ArrowDown}{Enter}");
});

test("should handle style blocks", async () => {
  const F = () => {
    return (
      <div>
        <MenuRoot
          menuItems={menuItems}
          ariaLabelledBy=""
          axe={menuAxeDefault}
          classes={{ base: "" }}
          state={{}}
          rtl
        />
        <div style={{ position: "relative", top: 200, left: 200 }}>ABC</div>
      </div>
    );
  };
  const screen = render(<F />);

  const favorites = screen.getByText("Favorites");

  await favorites.hover();
  await favorites.hover();

  await expect.element(screen.getByText("Github")).toBeVisible();

  const github = screen.getByText("Github");
  (github.element() as HTMLElement).focus();
  await expect.element(screen.getByText("Github")).toHaveFocus();

  await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{ArrowLeft}");

  await expect.element(screen.getByText("Victor")).toBeVisible();
  await userEvent.keyboard("{ArrowLeft}");

  await userEvent.hover(screen.getByText("Victor"));
  await userEvent.hover(screen.getByText("Victor"));

  await userEvent.unhover(screen.getByText("Victor"));
  await userEvent.unhover(screen.getByText("Victor"));

  await userEvent.keyboard("{ArrowLeft}{ArrowUp}{ArrowUp}");

  await userEvent.hover(screen.getByText("ABC"));
  await userEvent.hover(screen.getByText("ABC"));

  await page.screenshot();
});
