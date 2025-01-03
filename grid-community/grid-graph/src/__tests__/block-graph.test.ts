import { ROW_DEFAULT_PATH_SEPARATOR, ROW_TOTAL_KIND } from "@1771technologies/grid-constants";
import { makeGroupNode, makeLeafNode } from "../block-flatten/__tests__/make-row-nodes.js";
import { BlockGraph } from "../block-graph.js";
import { printGraph } from "./print-graph.js";

test("block graph for flat data", () => {
  const graph = new BlockGraph(5, "/");
  expect(graph.blockRootSize()).toEqual(0);

  graph.blockSetSize("", 200);
  graph.blockAdd([
    {
      index: 2,
      data: [
        makeLeafNode("x"),
        makeLeafNode("y"),
        makeLeafNode("z"),
        makeLeafNode("w"),
        makeLeafNode("u"),
      ],
      path: "",
    },
  ]);

  graph.blockAdd([
    {
      index: 4,
      data: [
        makeLeafNode("ax"),
        makeLeafNode("ay"),
        makeLeafNode("az"),
        makeLeafNode("aw"),
        makeLeafNode("av"),
      ],
      path: "",
    },
  ]);

  graph.blockFlatten();
  expect(graph.rowCount()).toEqual(200);

  expect(graph.blockRootSize()).toEqual(200);

  expect(graph.rowById("ax")).toMatchInlineSnapshot(`
    {
      "data": {},
      "id": "ax",
      "kind": 1,
      "rowIndex": null,
      "rowPin": null,
    }
  `);

  expect(printGraph(graph)).toMatchInlineSnapshot(`
    "
    10: x
    11: y
    12: z
    13: w
    14: u
    20: ax
    21: ay
    22: az
    23: aw
    24: av
    "
  `);

  expect(graph.rowIdToRowIndex("ax")).toEqual(20);
  expect(graph.rowIdToRowIndex("wx")).toEqual(undefined);

  expect(graph.rowGetAllRows().length).toEqual(10);

  graph.setTotalPosition("top");
  expect(graph.rowGetAllRows().length).toEqual(11);
  graph.setTotalPosition(null);

  graph.blockSetSize("", 20);
  graph.blockFlatten();

  expect(printGraph(graph)).toMatchInlineSnapshot(`
    "
    10: x
    11: y
    12: z
    13: w
    14: u
    "
  `);

  graph.blockReset();
  graph.blockFlatten();
  expect(printGraph(graph)).toMatchInlineSnapshot(`
    "

    "
  `);
});

test("should be able to delete blocks by path", () => {
  const graph = new BlockGraph(5);

  graph.blockSetSize("", 20);
  graph.blockSetSize("alpha", 10);
  graph.blockSetSize(`alpha${ROW_DEFAULT_PATH_SEPARATOR}a`, 10);
  graph.blockAdd([
    {
      data: [
        makeGroupNode("alpha", "alpha", true),
        makeGroupNode("beta", "beta", false),
        makeGroupNode("sigma", "sigma", false),
      ],
      index: 0,
      path: "",
    },
    {
      data: [makeGroupNode(`alpha${ROW_DEFAULT_PATH_SEPARATOR}a`, "a", true)],
      index: 0,
      path: "alpha",
    },
    {
      data: [
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
      ],
      index: 0,
      path: `alpha${ROW_DEFAULT_PATH_SEPARATOR}a`,
    },
  ]);

  graph.blockFlatten();

  expect(printGraph(graph)).toMatchInlineSnapshot(`
    "
    0: alpha
    1: alpha-->a
    2: alpha/a/1
    3: alpha/a/1
    4: alpha/a/1
    5: alpha/a/1
    21: beta
    22: sigma
    "
  `);

  graph.blockDeleteByPath("alpha");
  graph.blockFlatten();

  expect(printGraph(graph)).toMatchInlineSnapshot(`
    "
    0: alpha
    1: beta
    2: sigma
    "
  `);
});

test("should be able to delete a block outright", () => {
  const graph = new BlockGraph(5, "/");

  graph.blockSetSize("", 20);
  graph.blockSetSize("alpha", 10);
  graph.blockSetSize(`alpha/a`, 10);
  graph.blockAdd([
    {
      data: [
        makeGroupNode("alpha", "alpha", true),
        makeGroupNode("beta", "beta", false),
        makeGroupNode("sigma", "sigma", false),
      ],
      index: 0,
      path: "",
    },
    {
      data: [makeGroupNode(`alpha/a`, "a", true)],
      index: 0,
      path: "alpha",
    },
    {
      data: [
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
      ],
      index: 0,
      path: `alpha/a`,
    },
  ]);

  graph.blockFlatten();
  expect(printGraph(graph)).toMatchInlineSnapshot(`
    "
    0: alpha
    1: alpha/a
    2: alpha/a/1
    3: alpha/a/1
    4: alpha/a/1
    5: alpha/a/1
    21: beta
    22: sigma
    "
  `);

  expect(graph.rowAllLeafChildren(1).length).toEqual(4);
  expect(graph.rowAllLeafChildren(-1).length).toEqual(0);
  expect(graph.rowAllChildren(1)?.length).toEqual(4);
  expect(graph.rowAllChildren(-1)?.length).toEqual(0);

  // Can delete a block
  graph.blockDeleteById("alpha/a#0");
  graph.blockDeleteById("alpa/a#0"); // intentionally wrong
  graph.blockFlatten();
  expect(printGraph(graph)).toMatchInlineSnapshot(`
    "
    0: alpha
    1: alpha/a
    21: beta
    22: sigma
    "
  `);
});

test("should be able to update sizes", () => {
  const graph = new BlockGraph(5, "/");

  graph.blockSetSize("", 20);
  graph.blockSetSize("alpha", 10);
  graph.blockSetSize(`alpha/a`, 10);
  graph.blockAdd([
    {
      data: [
        makeGroupNode("alpha", "alpha", true),
        makeGroupNode("beta", "beta", false),
        makeGroupNode("sigma", "sigma", false),
      ],
      index: 0,
      path: "",
    },
    {
      data: [makeGroupNode(`alpha/a`, "a", true)],
      index: 0,
      path: "alpha",
    },
    {
      data: [
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
      ],
      index: 0,
      path: `alpha/a`,
    },
    {
      data: [
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
      ],
      index: 1,
      path: `alpha/a`,
    },
  ]);

  graph.blockSetSize("", 2000);
  graph.blockFlatten();

  expect(graph.rowCount()).toEqual(2020);

  // Setting size to zero will clear that child size, hence we lose 20 rows not 10 even though
  // alpha only has a size of 10.
  graph.blockSetSize("alpha", 0);
  graph.blockFlatten();
  expect(graph.rowCount()).toEqual(2000);
});

test("should be able to return the correct child counts", () => {
  const graph = new BlockGraph(5, "/");
  graph.blockSetSize("", 20);
  graph.blockSetSize("alpha", 15);
  graph.blockSetSize(`alpha/a`, 10);
  graph.blockAdd([
    {
      data: [
        makeGroupNode("alpha", "alpha", true),
        makeGroupNode("beta", "beta", false),
        makeGroupNode("sigma", "sigma", false),
      ],
      index: 0,
      path: "",
    },
    {
      data: [makeGroupNode(`alpha/a`, "a", true), makeGroupNode(`alpha/a`, "c", false)],
      index: 0,
      path: "alpha",
    },
    {
      data: [
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
      ],
      index: 0,
      path: `alpha/a`,
    },
    {
      data: [
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
      ],
      index: 1,
      path: `alpha/a`,
    },
  ]);

  graph.blockFlatten();

  let childCount = graph.rowChildCount(1);
  expect(childCount).toEqual(10);
  childCount = graph.rowChildCount(2);
  expect(childCount).toEqual(0);
  childCount = graph.rowChildCount(0);
  expect(childCount).toEqual(15);

  graph.blockReset();
});

test("range indices should return the correct result", () => {
  const graph = new BlockGraph(5, "/");

  graph.setTop([makeLeafNode("a"), makeLeafNode("b")]);
  graph.setBottom([makeLeafNode("ac"), makeLeafNode("bc")]);

  graph.blockSetSize("", 20);
  graph.blockSetSize("alpha", 10);
  graph.blockSetSize(`alpha/a`, 10);
  graph.blockAdd([
    {
      data: [
        makeGroupNode("alpha", "alpha", true),
        makeGroupNode("beta", "beta", false),
        makeGroupNode("sigma", "sigma", false),
      ],
      index: 0,
      path: "",
    },
    {
      data: [makeGroupNode(`alpha/a`, "a", true)],
      index: 0,
      path: "alpha",
    },
    {
      data: [
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
      ],
      index: 0,
      path: `alpha/a`,
    },
    {
      data: [
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
      ],
      index: 1,
      path: `alpha/a`,
    },
  ]);

  graph.blockFlatten();
  expect(graph.rowRangesForIndex(0)).toMatchInlineSnapshot(`
    [
      {
        "path": "",
        "rowEnd": 2,
        "rowStart": 0,
      },
    ]
  `);
  expect(graph.rowRangesForIndex(4)).toMatchInlineSnapshot(`
    [
      {
        "path": "",
        "rowEnd": 42,
        "rowStart": 2,
      },
      {
        "path": "alpha",
        "rowEnd": 23,
        "rowStart": 3,
      },
      {
        "path": "alpha/a",
        "rowEnd": 14,
        "rowStart": 4,
      },
    ]
  `);
  expect(graph.rowRangesForIndex(42)).toMatchInlineSnapshot(`
    [
      {
        "path": "",
        "rowEnd": 44,
        "rowStart": 42,
      },
    ]
  `);
  expect(graph.rowRangesForIndex(111)).toMatchInlineSnapshot(`[]`);
});

test("range indices should return the correct result with totals", () => {
  const graph = new BlockGraph(5, "/");

  graph.setTotal({ data: {}, id: "eerfe", kind: ROW_TOTAL_KIND, rowIndex: 1, rowPin: null });
  graph.setTotalPin(false);
  graph.setTotalPosition("top");

  graph.setTop([makeLeafNode("a"), makeLeafNode("b")]);
  graph.setBottom([makeLeafNode("ac"), makeLeafNode("bc")]);

  graph.blockSetSize("", 20);
  graph.blockSetSize("alpha", 10);
  graph.blockSetSize(`alpha/a`, 10);
  graph.blockAdd([
    {
      data: [
        makeGroupNode("alpha", "alpha", true),
        makeGroupNode("beta", "beta", false),
        makeGroupNode("sigma", "sigma", false),
      ],
      index: 0,
      path: "",
    },
    {
      data: [makeGroupNode(`alpha/a`, "a", true)],
      index: 0,
      path: "alpha",
    },
    {
      data: [
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
      ],
      index: 0,
      path: `alpha/a`,
    },
    {
      data: [
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
        makeLeafNode("alpha/a/1"),
      ],
      index: 1,
      path: `alpha/a`,
    },
  ]);

  graph.blockFlatten();
  expect(graph.rowRangesForIndex(0)).toMatchInlineSnapshot(`
    [
      {
        "path": "",
        "rowEnd": 2,
        "rowStart": 0,
      },
    ]
  `);
  expect(graph.rowRangesForIndex(4)).toMatchInlineSnapshot(`
    [
      {
        "path": "",
        "rowEnd": 44,
        "rowStart": 2,
      },
      {
        "path": "alpha",
        "rowEnd": 24,
        "rowStart": 4,
      },
    ]
  `);
  expect(graph.rowRangesForIndex(42)).toMatchInlineSnapshot(`
    [
      {
        "path": "",
        "rowEnd": 44,
        "rowStart": 2,
      },
    ]
  `);
  expect(graph.rowRangesForIndex(111)).toMatchInlineSnapshot(`[]`);

  graph.setTotalPin(true);
  graph.blockFlatten();
  expect(graph.rowRangesForIndex(2)).toMatchInlineSnapshot(`
    [
      {
        "path": "",
        "rowEnd": 3,
        "rowStart": 0,
      },
    ]
  `);

  graph.setTotalPosition("bottom");
  graph.blockFlatten();
  expect(graph.rowRangesForIndex(2)).toMatchInlineSnapshot(`
    [
      {
        "path": "",
        "rowEnd": 42,
        "rowStart": 2,
      },
    ]
  `);
  expect(graph.rowRangesForIndex(44)).toMatchInlineSnapshot(`
    [
      {
        "path": "",
        "rowEnd": 45,
        "rowStart": 42,
      },
    ]
  `);
});
