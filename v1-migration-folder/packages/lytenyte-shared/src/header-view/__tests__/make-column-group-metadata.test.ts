import { describe, expect, test } from "vitest";
import { makeColumnGroupMetadata, type PartialColumns } from "../make-column-group-metadata.js";

describe("makeColumnGroupMetadata", () => {
  test("should create the correct meta", () => {
    const columns = [
      { id: "x", groupPath: ["X"], groupVisibility: "open" },
      { id: "y" },
      { id: "t", groupPath: ["A", "B"], groupVisibility: "close" },
      { id: "a", groupPath: ["A", "B"], groupVisibility: "open" },
      { id: "f", groupPath: ["X"], groupVisibility: "always" },
      { id: "aa", groupPath: ["V"] },
      { id: "r", groupPath: ["T"], groupVisibility: "always" },
      { id: "bb", groupPath: ["V"], groupVisibility: "close" },
    ] as PartialColumns[];

    const meta = makeColumnGroupMetadata(columns, "#");

    expect(meta.colIdToGroupIds).toMatchInlineSnapshot(`
      Map {
        "x" => [
          "X",
        ],
        "t" => [
          "A",
          "A#B",
        ],
        "a" => [
          "A",
          "A#B",
        ],
        "f" => [
          "X",
        ],
        "aa" => [
          "V",
        ],
        "r" => [
          "T",
        ],
        "bb" => [
          "V",
        ],
      }
    `);

    expect(meta.groupIsCollapsible).toMatchInlineSnapshot(`
      Map {
        "X" => true,
        "A" => true,
        "A#B" => true,
        "V" => true,
        "T" => false,
      }
    `);
    expect(meta.validGroupIds).toMatchInlineSnapshot(`
      Set {
        "X",
        "A",
        "A#B",
        "V",
        "T",
      }
    `);
  });
  test("should handle empty column set", () => {
    const meta = makeColumnGroupMetadata([], "#");
    expect(meta).toMatchInlineSnapshot(`
      {
        "colIdToGroupIds": Map {},
        "groupIsCollapsible": Map {},
        "validGroupIds": Set {},
      }
    `);
  });
});
