import { expect, test } from "vitest";
import type { TreeRoot } from "../+types.async-tree.js";
import { maybeApplySetActionItems } from "../maybe-apply-set-action-items.js";

test("applySetActionToTree: should apply items when possible", () => {
  const root: TreeRoot<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    size: 10,
    kind: "root",
  };

  maybeApplySetActionItems({ path: [], items: [] }, root);
  maybeApplySetActionItems({ path: [], items: undefined }, root);

  maybeApplySetActionItems(
    {
      path: [],
      size: 10,
      items: [
        { data: 2, relIndex: 0, kind: "leaf" },
        { data: 2, relIndex: 1, kind: "leaf" },
        { data: 2, relIndex: 2, kind: "leaf" },
        { data: 2, relIndex: 3, kind: "leaf" },
      ],
    },
    root,
  );

  expect([...root.byIndex.keys()]).toMatchInlineSnapshot(`
    [
      0,
      1,
      2,
      3,
    ]
  `);
  expect([...root.byPath.keys()]).toMatchInlineSnapshot(`
    [
      "__|#-Root-#|__#0",
      "__|#-Root-#|__#1",
      "__|#-Root-#|__#2",
      "__|#-Root-#|__#3",
    ]
  `);
});

test("applySetActionToTree: should not apply when items are empty", () => {
  const root: TreeRoot<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    size: 10,
    kind: "root",
  };

  maybeApplySetActionItems(
    {
      path: [],
      size: 10,
    },
    root,
  );

  expect([...root.byIndex.keys()]).toMatchInlineSnapshot(`[]`);
  expect([...root.byPath.keys()]).toMatchInlineSnapshot(`[]`);
});

test("applySetActionToTree: can perform overriding applies", () => {
  const root: TreeRoot<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    size: 10,
    kind: "root",
  };

  maybeApplySetActionItems(
    {
      path: [],
      size: 10,
      items: [
        { data: 2, relIndex: 0, kind: "leaf" },
        { data: 2, relIndex: 1, kind: "leaf" },
        { data: 2, relIndex: 2, kind: "leaf" },
        { data: 2, relIndex: 3, kind: "leaf" },
      ],
    },
    root,
  );

  maybeApplySetActionItems(
    {
      path: [],
      size: 10,
      items: [
        { data: 2, relIndex: 0, kind: "leaf" },
        { data: 2, relIndex: 1, kind: "leaf" },
        { data: 2, relIndex: 2, kind: "parent", path: "A", size: 10 },
        { data: 2, relIndex: 3, kind: "parent", path: "B", size: 11 },
        { data: 2, relIndex: 4, kind: "leaf" },
      ],
    },
    root,
  );

  expect([...root.byIndex.keys()]).toMatchInlineSnapshot(`
    [
      0,
      1,
      2,
      3,
      4,
    ]
  `);
  expect([...root.byPath.keys()]).toMatchInlineSnapshot(`
    [
      "__|#-Root-#|__#0",
      "__|#-Root-#|__#1",
      "A",
      "B",
      "__|#-Root-#|__#4",
    ]
  `);
});

test("applySetActionToTree: can perform apply with gaps", () => {
  const root: TreeRoot<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    size: 10,
    kind: "root",
  };

  maybeApplySetActionItems(
    {
      path: [],
      size: 10,
      items: [
        { data: 2, relIndex: 0, kind: "leaf" },
        { data: 2, relIndex: 1, kind: "leaf" },
        { data: 2, relIndex: 2, kind: "leaf" },
        { data: 2, relIndex: 3, kind: "leaf" },
      ],
    },
    root,
  );

  maybeApplySetActionItems(
    {
      path: [],
      size: 10,
      items: [
        { data: 2, relIndex: 0, kind: "leaf" },
        { data: 2, relIndex: 1, kind: "leaf" },
        { data: 2, relIndex: 2, kind: "parent", path: "A", size: 10 },
        { data: 2, relIndex: 3, kind: "parent", path: "B", size: 11 },
        { data: 2, relIndex: 4, kind: "leaf" },
      ],
    },
    root,
  );

  maybeApplySetActionItems(
    {
      path: [],
      size: 12,
      items: [
        { data: 2, relIndex: 8, kind: "parent", path: "A", size: 10 },
        { data: 2, relIndex: 9, kind: "parent", path: "B", size: 11 },
        { data: 2, relIndex: 10, kind: "leaf" },
      ],
    },
    root,
  );

  expect([...root.byIndex.keys()]).toMatchInlineSnapshot(`
    [
      0,
      1,
      4,
      8,
      9,
      10,
    ]
  `);
  expect([...root.byPath.keys()]).toMatchInlineSnapshot(`
    [
      "__|#-Root-#|__#0",
      "__|#-Root-#|__#1",
      "__|#-Root-#|__#4",
      "A",
      "B",
      "__|#-Root-#|__#10",
    ]
  `);
});
