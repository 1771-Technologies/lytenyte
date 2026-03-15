import { describe, expect, test } from "vitest";
import { columnAddRowGroup } from "./column-add-row-group.js";

describe("columnAddRowGroup", () => {
  test("Should add the group column when row grouping is enabled and depth is greater than 0", () => {
    const columns = [{ id: "x" }];

    expect(columnAddRowGroup({ columns, rowGroupDepth: 1, rowGroupTemplate: {} })).toMatchInlineSnapshot(`
      [
        {
          "id": "__ln_group__",
          "name": "Group",
        },
        {
          "id": "x",
        },
      ]
    `);
  });

  test("Should not add the group column when rowGroupTemplate is false", () => {
    const columns = [{ id: "x" }];

    expect(columnAddRowGroup({ columns, rowGroupDepth: 1, rowGroupTemplate: false })).toMatchInlineSnapshot(`
      [
        {
          "id": "x",
        },
      ]
    `);
  });

  test("Should not add the group column when rowGroupDepth is 0", () => {
    const columns = [{ id: "x" }];

    expect(columnAddRowGroup({ columns, rowGroupDepth: 0, rowGroupTemplate: {} })).toMatchInlineSnapshot(`
      [
        {
          "id": "x",
        },
      ]
    `);
  });

  test("Should include additional group column properties from the template", () => {
    const columns = [{ id: "x" }];

    expect(
      columnAddRowGroup({
        columns,
        rowGroupDepth: 2,
        rowGroupTemplate: { name: "Custom Group", width: 200, pin: "start" },
      }),
    ).toMatchInlineSnapshot(`
      [
        {
          "id": "__ln_group__",
          "name": "Custom Group",
          "pin": "start",
          "width": 200,
        },
        {
          "id": "x",
        },
      ]
    `);
  });

  test("Should override the base group name when provided in the template", () => {
    const columns = [{ id: "x" }];

    expect(
      columnAddRowGroup({
        columns,
        rowGroupDepth: 1,
        rowGroupTemplate: { name: "Row Group" },
      }),
    ).toMatchInlineSnapshot(`
      [
        {
          "id": "__ln_group__",
          "name": "Row Group",
        },
        {
          "id": "x",
        },
      ]
    `);
  });
});
