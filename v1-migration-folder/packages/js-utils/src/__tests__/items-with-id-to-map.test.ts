import { describe, expect, test } from "vitest";
import { itemsWithIdToMap } from "../items-with-id-to-map.js";

describe("itemsWithIdToMap", () => {
  test(" should return the correct value", () => {
    expect(itemsWithIdToMap([{ id: "x" }, { id: "z" }])).toMatchInlineSnapshot(`
    Map {
      "x" => {
        "id": "x",
      },
      "z" => {
        "id": "z",
      },
    }
  `);
  });
});
