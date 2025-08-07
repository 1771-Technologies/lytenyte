import { expect, test, vi } from "vitest";
import type { TreeRoot } from "../+types.async-tree.js";
import { applySetActionToTree } from "../apply-set-action-to-tree.js";
import { printTreeByIndex } from "./print-tree.js";

test("applySetActionToTree: adding items to the root", () => {
  const root: TreeRoot<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    kind: "root",
    size: 10,
  };

  applySetActionToTree(
    {
      path: [],
      items: [
        { kind: "leaf", data: 2, relIndex: 0 },
        { kind: "leaf", data: 2, relIndex: 1 },
        { kind: "leaf", data: 2, relIndex: 2 },
      ],
    },
    root,
  );

  expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
    "
    #
    ├─ 0 / L / $#0 / $ / DATA: 2
    ├─ 1 / L / $#1 / $ / DATA: 2
    ├─ 2 / L / $#2 / $ / DATA: 2"
  `);
});

test("applySetActionToTree: adding parent items to the root", () => {
  const root: TreeRoot<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    kind: "root",
    size: 10,
  };

  applySetActionToTree(
    {
      path: [],
      items: [
        { kind: "parent", data: 11, relIndex: 2, path: "A", size: 2 },
        { kind: "parent", data: 11, relIndex: 3, path: "B", size: 2 },
        { kind: "parent", data: 11, relIndex: 4, path: "C", size: 2 },
      ],
    },
    root,
  );

  expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
    "
    #
    ├─ 2 / P / A / $ / SIZE: 2 / DATA: 11
    ├─ 3 / P / B / $ / SIZE: 2 / DATA: 11
    ├─ 4 / P / C / $ / SIZE: 2 / DATA: 11"
  `);
});

test("applySetActionToTree: adding parent items to the root", () => {
  const root: TreeRoot<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    kind: "root",
    size: 10,
  };

  applySetActionToTree(
    {
      path: [],
      items: [
        { kind: "parent", data: 11, relIndex: 2, path: "A", size: 2 },
        { kind: "parent", data: 11, relIndex: 3, path: "B", size: 2 },
        { kind: "parent", data: 11, relIndex: 4, path: "C", size: 2 },
        { kind: "leaf", data: 1, relIndex: 5 },
        { kind: "leaf", data: 1, relIndex: 6 },
      ],
    },
    root,
  );

  expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
    "
    #
    ├─ 2 / P / A / $ / SIZE: 2 / DATA: 11
    ├─ 3 / P / B / $ / SIZE: 2 / DATA: 11
    ├─ 4 / P / C / $ / SIZE: 2 / DATA: 11
    ├─ 5 / L / $#5 / $ / DATA: 1
    ├─ 6 / L / $#6 / $ / DATA: 1"
  `);
});

test("applySetActionToTree: re-ordering items on the root should work", () => {
  const root: TreeRoot<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    kind: "root",
    size: 10,
  };

  applySetActionToTree(
    {
      path: [],
      items: [
        { kind: "parent", data: 11, relIndex: 2, path: "A", size: 2 },
        { kind: "parent", data: 11, relIndex: 3, path: "B", size: 2 },
        { kind: "parent", data: 11, relIndex: 4, path: "C", size: 2 },
        { kind: "leaf", data: 1, relIndex: 5 },
        { kind: "leaf", data: 1, relIndex: 6 },
      ],
    },
    root,
  );

  applySetActionToTree(
    {
      path: [],
      items: [
        { kind: "parent", data: 11, relIndex: 0, path: "A", size: 2 },
        { kind: "parent", data: 11, relIndex: 3, path: "B", size: 2 },
        { kind: "parent", data: 11, relIndex: 4, path: "C", size: 2 },
        { kind: "leaf", data: 1, relIndex: 8 },
        { kind: "leaf", data: 1, relIndex: 9 },
      ],
    },
    root,
  );

  expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
    "
    #
    ├─ 0 / P / A / $ / SIZE: 2 / DATA: 11
    ├─ 3 / P / B / $ / SIZE: 2 / DATA: 11
    ├─ 4 / P / C / $ / SIZE: 2 / DATA: 11
    ├─ 5 / L / $#5 / $ / DATA: 1
    ├─ 6 / L / $#6 / $ / DATA: 1
    ├─ 8 / L / $#8 / $ / DATA: 1
    ├─ 9 / L / $#9 / $ / DATA: 1"
  `);
});

test("applySetActionToTree: should be able to overwrite items", () => {
  const root: TreeRoot<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    kind: "root",
    size: 10,
  };

  applySetActionToTree(
    {
      path: [],
      items: [
        { kind: "parent", data: 11, relIndex: 2, path: "A", size: 2 },
        { kind: "parent", data: 11, relIndex: 3, path: "B", size: 2 },
        { kind: "parent", data: 11, relIndex: 4, path: "C", size: 2 },
        { kind: "leaf", data: 1, relIndex: 5 },
        { kind: "leaf", data: 1, relIndex: 6 },
      ],
    },
    root,
  );

  applySetActionToTree(
    {
      path: [],
      items: [
        { kind: "leaf", data: 12, relIndex: 2 },
        { kind: "leaf", data: 9, relIndex: 3 },
        { kind: "leaf", data: 3, relIndex: 4 },
        { kind: "leaf", data: 1, relIndex: 5 },
        { kind: "leaf", data: 1, relIndex: 6 },
      ],
    },
    root,
  );

  expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
    "
    #
    ├─ 2 / L / $#2 / $ / DATA: 12
    ├─ 3 / L / $#3 / $ / DATA: 9
    ├─ 4 / L / $#4 / $ / DATA: 3
    ├─ 5 / L / $#5 / $ / DATA: 1
    ├─ 6 / L / $#6 / $ / DATA: 1"
  `);
});

test("applySetActionToTree: should be able to resize the root", () => {
  const root: TreeRoot<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    kind: "root",
    size: 10,
  };

  applySetActionToTree(
    {
      path: [],
      items: [
        { kind: "parent", data: 11, relIndex: 2, path: "A", size: 2 },
        { kind: "parent", data: 11, relIndex: 3, path: "B", size: 2 },
        { kind: "parent", data: 11, relIndex: 4, path: "C", size: 2 },
        { kind: "leaf", data: 1, relIndex: 5 },
        { kind: "leaf", data: 1, relIndex: 6 },
      ],
    },
    root,
  );

  applySetActionToTree(
    {
      path: [],
      size: 3,
    },
    root,
  );

  expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
    "
    #
    ├─ 2 / P / A / $ / SIZE: 2 / DATA: 11"
  `);
});

test("applySetActionToTree: should be able to resize the root", () => {
  const root: TreeRoot<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    kind: "root",
    size: 10,
  };

  applySetActionToTree(
    {
      path: [],
      items: [
        { kind: "parent", data: 11, relIndex: 2, path: "A", size: 10 },
        { kind: "parent", data: 11, relIndex: 3, path: "B", size: 10 },
        { kind: "parent", data: 11, relIndex: 4, path: "C", size: 10 },
        { kind: "leaf", data: 1, relIndex: 5 },
        { kind: "leaf", data: 1, relIndex: 6 },
      ],
    },
    root,
  );

  applySetActionToTree(
    {
      path: ["A"],
      items: [
        { kind: "leaf", data: "l", relIndex: 0 },
        { kind: "leaf", data: "a", relIndex: 3 },
        { kind: "leaf", data: "l", relIndex: 4 },
        { kind: "parent", data: 11, relIndex: 5, path: "AA", size: 10 },
      ],
    },
    root,
  );

  expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
    "
    #
    ├─ 2 / P / A / $ / SIZE: 10 / DATA: 11
       ├─ 0 / L / A#0 / 2 / DATA: "l"
       ├─ 3 / L / A#3 / 2 / DATA: "a"
       ├─ 4 / L / A#4 / 2 / DATA: "l"
       ├─ 5 / P / AA / 2 / SIZE: 10 / DATA: 11
    ├─ 3 / P / B / $ / SIZE: 10 / DATA: 11
    ├─ 4 / P / C / $ / SIZE: 10 / DATA: 11
    ├─ 5 / L / $#5 / $ / DATA: 1
    ├─ 6 / L / $#6 / $ / DATA: 1"
  `);

  applySetActionToTree(
    {
      path: ["A", "AA"],
      items: [
        { kind: "leaf", data: "l", relIndex: 0 },
        { kind: "leaf", data: "a", relIndex: 3 },
        { kind: "leaf", data: "l", relIndex: 4 },
      ],
    },
    root,
  );

  expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
    "
    #
    ├─ 2 / P / A / $ / SIZE: 10 / DATA: 11
       ├─ 0 / L / A#0 / 2 / DATA: "l"
       ├─ 3 / L / A#3 / 2 / DATA: "a"
       ├─ 4 / L / A#4 / 2 / DATA: "l"
       ├─ 5 / P / AA / 2 / SIZE: 10 / DATA: 11
          ├─ 0 / L / AA#0 / 5 / DATA: "l"
          ├─ 3 / L / AA#3 / 5 / DATA: "a"
          ├─ 4 / L / AA#4 / 5 / DATA: "l"
    ├─ 3 / P / B / $ / SIZE: 10 / DATA: 11
    ├─ 4 / P / C / $ / SIZE: 10 / DATA: 11
    ├─ 5 / L / $#5 / $ / DATA: 1
    ├─ 6 / L / $#6 / $ / DATA: 1"
  `);

  applySetActionToTree(
    {
      path: ["C"],
      items: [
        { kind: "leaf", data: "x", relIndex: 8 },
        { kind: "parent", data: "z", relIndex: 9, path: "CC", size: 10 },
        { kind: "parent", data: "z", relIndex: 4, path: "CB", size: 10 },
      ],
    },
    root,
  );

  expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
    "
    #
    ├─ 2 / P / A / $ / SIZE: 10 / DATA: 11
       ├─ 0 / L / A#0 / 2 / DATA: "l"
       ├─ 3 / L / A#3 / 2 / DATA: "a"
       ├─ 4 / L / A#4 / 2 / DATA: "l"
       ├─ 5 / P / AA / 2 / SIZE: 10 / DATA: 11
          ├─ 0 / L / AA#0 / 5 / DATA: "l"
          ├─ 3 / L / AA#3 / 5 / DATA: "a"
          ├─ 4 / L / AA#4 / 5 / DATA: "l"
    ├─ 3 / P / B / $ / SIZE: 10 / DATA: 11
    ├─ 4 / P / C / $ / SIZE: 10 / DATA: 11
       ├─ 4 / P / CB / 4 / SIZE: 10 / DATA: z
       ├─ 8 / L / C#8 / 4 / DATA: "x"
       ├─ 9 / P / CC / 4 / SIZE: 10 / DATA: z
    ├─ 5 / L / $#5 / $ / DATA: 1
    ├─ 6 / L / $#6 / $ / DATA: 1"
  `);

  applySetActionToTree(
    {
      path: ["A"],
      items: [
        {
          relIndex: 0,
          data: 22,
          kind: "parent",
          path: "AA",
          size: 10,
        },
      ],
    },
    root,
  );

  expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
    "
    #
    ├─ 2 / P / A / $ / SIZE: 10 / DATA: 11
       ├─ 0 / P / AA / 2 / SIZE: 10 / DATA: 22
          ├─ 0 / L / AA#0 / 5 / DATA: "l"
          ├─ 3 / L / AA#3 / 5 / DATA: "a"
          ├─ 4 / L / AA#4 / 5 / DATA: "l"
       ├─ 3 / L / A#3 / 2 / DATA: "a"
       ├─ 4 / L / A#4 / 2 / DATA: "l"
    ├─ 3 / P / B / $ / SIZE: 10 / DATA: 11
    ├─ 4 / P / C / $ / SIZE: 10 / DATA: 11
       ├─ 4 / P / CB / 4 / SIZE: 10 / DATA: z
       ├─ 8 / L / C#8 / 4 / DATA: "x"
       ├─ 9 / P / CC / 4 / SIZE: 10 / DATA: z
    ├─ 5 / L / $#5 / $ / DATA: 1
    ├─ 6 / L / $#6 / $ / DATA: 1"
  `);

  applySetActionToTree(
    {
      path: ["A", "AA"],
      size: 2,
    },
    root,
  );

  expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
    "
    #
    ├─ 2 / P / A / $ / SIZE: 10 / DATA: 11
       ├─ 0 / P / AA / 2 / SIZE: 2 / DATA: 22
          ├─ 0 / L / AA#0 / 5 / DATA: "l"
       ├─ 3 / L / A#3 / 2 / DATA: "a"
       ├─ 4 / L / A#4 / 2 / DATA: "l"
    ├─ 3 / P / B / $ / SIZE: 10 / DATA: 11
    ├─ 4 / P / C / $ / SIZE: 10 / DATA: 11
       ├─ 4 / P / CB / 4 / SIZE: 10 / DATA: z
       ├─ 8 / L / C#8 / 4 / DATA: "x"
       ├─ 9 / P / CC / 4 / SIZE: 10 / DATA: z
    ├─ 5 / L / $#5 / $ / DATA: 1
    ├─ 6 / L / $#6 / $ / DATA: 1"
  `);

  applySetActionToTree(
    {
      path: ["A"],
      items: [{ kind: "leaf", relIndex: 0, data: "c" }],
    },
    root,
  );

  expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
    "
    #
    ├─ 2 / P / A / $ / SIZE: 10 / DATA: 11
       ├─ 0 / L / A#0 / 2 / DATA: "c"
       ├─ 3 / L / A#3 / 2 / DATA: "a"
       ├─ 4 / L / A#4 / 2 / DATA: "l"
    ├─ 3 / P / B / $ / SIZE: 10 / DATA: 11
    ├─ 4 / P / C / $ / SIZE: 10 / DATA: 11
       ├─ 4 / P / CB / 4 / SIZE: 10 / DATA: z
       ├─ 8 / L / C#8 / 4 / DATA: "x"
       ├─ 9 / P / CC / 4 / SIZE: 10 / DATA: z
    ├─ 5 / L / $#5 / $ / DATA: 1
    ├─ 6 / L / $#6 / $ / DATA: 1"
  `);

  applySetActionToTree(
    {
      path: ["A"],
      items: [{ kind: "parent", relIndex: 0, data: "c", path: "AA", size: 10 }],
    },
    root,
  );

  expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
    "
    #
    ├─ 2 / P / A / $ / SIZE: 10 / DATA: 11
       ├─ 0 / P / AA / 2 / SIZE: 10 / DATA: c
       ├─ 3 / L / A#3 / 2 / DATA: "a"
       ├─ 4 / L / A#4 / 2 / DATA: "l"
    ├─ 3 / P / B / $ / SIZE: 10 / DATA: 11
    ├─ 4 / P / C / $ / SIZE: 10 / DATA: 11
       ├─ 4 / P / CB / 4 / SIZE: 10 / DATA: z
       ├─ 8 / L / C#8 / 4 / DATA: "x"
       ├─ 9 / P / CC / 4 / SIZE: 10 / DATA: z
    ├─ 5 / L / $#5 / $ / DATA: 1
    ├─ 6 / L / $#6 / $ / DATA: 1"
  `);

  applySetActionToTree(
    {
      path: ["A", "AA"],
      items: [
        { kind: "parent", relIndex: 2, data: "c", path: "AAA", size: 10 },
        { kind: "parent", relIndex: 3, data: "z", path: "AAB", size: 10 },
      ],
    },
    root,
  );
  applySetActionToTree(
    {
      path: ["A", "AA", "AAB"],
      items: [
        { kind: "leaf", relIndex: 2, data: "c" },
        { kind: "leaf", relIndex: 3, data: "z" },
      ],
    },
    root,
  );

  expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
    "
    #
    ├─ 2 / P / A / $ / SIZE: 10 / DATA: 11
       ├─ 0 / P / AA / 2 / SIZE: 10 / DATA: c
          ├─ 2 / P / AAA / 0 / SIZE: 10 / DATA: c
          ├─ 3 / P / AAB / 0 / SIZE: 10 / DATA: z
             ├─ 2 / L / AAB#2 / 3 / DATA: "c"
             ├─ 3 / L / AAB#3 / 3 / DATA: "z"
       ├─ 3 / L / A#3 / 2 / DATA: "a"
       ├─ 4 / L / A#4 / 2 / DATA: "l"
    ├─ 3 / P / B / $ / SIZE: 10 / DATA: 11
    ├─ 4 / P / C / $ / SIZE: 10 / DATA: 11
       ├─ 4 / P / CB / 4 / SIZE: 10 / DATA: z
       ├─ 8 / L / C#8 / 4 / DATA: "x"
       ├─ 9 / P / CC / 4 / SIZE: 10 / DATA: z
    ├─ 5 / L / $#5 / $ / DATA: 1
    ├─ 6 / L / $#6 / $ / DATA: 1"
  `);

  applySetActionToTree(
    {
      path: ["A", "AA"],
      items: [
        { kind: "leaf", relIndex: 2, data: "c" },
        { kind: "leaf", relIndex: 3, data: "z" },
      ],
    },
    root,
  );

  expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
    "
    #
    ├─ 2 / P / A / $ / SIZE: 10 / DATA: 11
       ├─ 0 / P / AA / 2 / SIZE: 10 / DATA: c
          ├─ 2 / L / AA#2 / 0 / DATA: "c"
          ├─ 3 / L / AA#3 / 0 / DATA: "z"
       ├─ 3 / L / A#3 / 2 / DATA: "a"
       ├─ 4 / L / A#4 / 2 / DATA: "l"
    ├─ 3 / P / B / $ / SIZE: 10 / DATA: 11
    ├─ 4 / P / C / $ / SIZE: 10 / DATA: 11
       ├─ 4 / P / CB / 4 / SIZE: 10 / DATA: z
       ├─ 8 / L / C#8 / 4 / DATA: "x"
       ├─ 9 / P / CC / 4 / SIZE: 10 / DATA: z
    ├─ 5 / L / $#5 / $ / DATA: 1
    ├─ 6 / L / $#6 / $ / DATA: 1"
  `);
});

test("applySetActionToTree: should correctly handle error checks", () => {
  const root: TreeRoot<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    kind: "root",
    size: 10,
  };

  const err = console.error;
  const fn = vi.fn();
  console.error = fn;

  expect(
    applySetActionToTree(
      {
        path: [],
        items: [
          { kind: "leaf", relIndex: 0, data: 2 },
          { kind: "leaf", relIndex: 0, data: 2 },
        ],
      },
      root,
    ),
  ).toEqual(false);
  expect(
    applySetActionToTree(
      {
        path: [],
        items: [
          { kind: "bb" as "leaf", relIndex: 1, data: 2 },
          { kind: "leaf", relIndex: 0, data: 2 },
        ],
      },
      root,
    ),
  ).toEqual(false);

  expect(
    applySetActionToTree(
      {
        path: ["A"],
        items: [
          { kind: "leaf", relIndex: 1, data: 2 },
          { kind: "leaf", relIndex: 0, data: 2 },
        ],
      },
      root,
    ),
  ).toEqual(false);

  expect(
    applySetActionToTree(
      {
        path: [],
        items: [
          { kind: "leaf", relIndex: 1.5, data: 2 },
          { kind: "leaf", relIndex: 0, data: 2 },
        ],
      },
      root,
    ),
  ).toEqual(false);

  expect(
    applySetActionToTree(
      {
        path: [],
        items: [
          { kind: "leaf", relIndex: 20, data: 2 },
          { kind: "leaf", relIndex: 0, data: 2 },
        ],
      },
      root,
    ),
  ).toEqual(false);

  expect(
    applySetActionToTree(
      {
        path: [],
        size: 10,
      },
      root,
    ),
  ).toEqual(false);

  applySetActionToTree(
    { path: [], items: [{ kind: "parent", data: 11, relIndex: 0, path: "A", size: 10 }] },
    root,
  );

  expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
    "
    #
    ├─ 0 / P / A / $ / SIZE: 10 / DATA: 11"
  `);

  expect(
    applySetActionToTree(
      {
        path: ["A"],
        size: 0,
      },
      root,
    ),
  ).toEqual(true);

  expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
    "
    #"
  `);

  expect(
    applySetActionToTree(
      {
        path: [],
      },
      root,
    ),
  ).toEqual(false);

  console.error = err;
});
