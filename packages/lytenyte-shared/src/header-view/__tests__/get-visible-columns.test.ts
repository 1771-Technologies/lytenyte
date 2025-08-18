import { describe, expect, test } from "vitest";
import { getVisibleColumns } from "../get-visible-columns.js";

describe("getVisibleColumns", () => {
  test("should return the correct result when hide is present and not present", () => {
    expect(getVisibleColumns([{ hide: true }, { id: "x" }, { id: "y" }], {})).toMatchInlineSnapshot(
      `
      [
        {
          "id": "x",
        },
        {
          "id": "y",
        },
      ]
    `,
    );
  });
  test("should return the correct value when base column is set", () => {
    expect(getVisibleColumns([{ id: "x" }, { id: "y" }, { id: "z", hide: false }], { hide: true }))
      .toMatchInlineSnapshot(`
      [
        {
          "hide": false,
          "id": "z",
        },
      ]
    `);
  });
});
