import { srOnlyStyle } from "../sr-only-styles";

test("should have the correct form", () => {
  expect(srOnlyStyle).toMatchInlineSnapshot(`
    {
      "border": "0px",
      "clip": "rect(0,0,0,0)",
      "height": "1px",
      "margin": "-1px",
      "overflow": "hidden",
      "padding": 0,
      "position": "absolute",
      "whiteSpace": "nowrap",
      "width": "1px",
    }
  `);
});
