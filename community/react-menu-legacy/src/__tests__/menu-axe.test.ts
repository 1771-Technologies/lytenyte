import { menuAxeDefault } from "../menu-axe";

test("default items should be correct", () => {
  expect(menuAxeDefault).toMatchInlineSnapshot(`
    {
      "axeDescription": "Use the down arrow to move down between items. Use the up arrow to move up items. Items with sub menus can be opened using the left arrow, and closed using the right arrow.Items can be activated using the space or enter keys.",
    }
  `);
});
