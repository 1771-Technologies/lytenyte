import { RangeTree, type FlattenedRange, type RangeNode } from "../range-tree.js";

// Helper to get the last part of a path
function getPathLeaf(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1];
}

function printRangeTree(node: RangeNode, prefix = ""): string {
  let result = "";
  if (prefix === "") {
    // Root node
    result = `${getPathLeaf(node.range.path)} [${node.range.rowStart}-${node.range.rowEnd}]\n`;
  }

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const isLast = i === node.children.length - 1;

    result += `${prefix}${isLast ? "└── " : "├── "}${getPathLeaf(child.range.path)} [${child.range.rowStart}-${child.range.rowEnd}]\n`;

    result += printRangeTree(child, `${prefix}${isLast ? "    " : "│   "}`);
  }

  return result;
}

test("should correctly build and print a simple hierarchical tree", () => {
  const ranges: FlattenedRange[] = [
    { rowStart: 0, rowEnd: 50, path: "root" },
    { rowStart: 0, rowEnd: 25, path: "root/leftBranch" },
    { rowStart: 25, rowEnd: 50, path: "root/rightBranch" },
    { rowStart: 0, rowEnd: 10, path: "root/leftBranch/leaf1" },
    { rowStart: 25, rowEnd: 35, path: "root/rightBranch/leaf2" },
  ];

  const tree = new RangeTree(ranges);

  expect(printRangeTree(tree.root)).toMatchInlineSnapshot(`
    "root [0-50]
    ├── leftBranch [0-25]
    │   └── leaf1 [0-10]
    └── rightBranch [25-50]
        └── leaf2 [25-35]
    "
  `);
});

test("should handle multiple levels with non-overlapping siblings", () => {
  const ranges: FlattenedRange[] = [
    { rowStart: 0, rowEnd: 100, path: "root" },
    { rowStart: 0, rowEnd: 30, path: "root/section1" },
    { rowStart: 30, rowEnd: 60, path: "root/section2" },
    { rowStart: 60, rowEnd: 100, path: "root/section3" },
    { rowStart: 0, rowEnd: 10, path: "root/section1/part1" },
    { rowStart: 10, rowEnd: 20, path: "root/section1/part2" },
    { rowStart: 30, rowEnd: 45, path: "root/section2/part1" },
    { rowStart: 45, rowEnd: 60, path: "root/section2/part2" },
    { rowStart: 60, rowEnd: 80, path: "root/section3/part1" },
    { rowStart: 80, rowEnd: 100, path: "root/section3/part2" },
  ];

  const tree = new RangeTree(ranges);

  expect(printRangeTree(tree.root)).toMatchInlineSnapshot(`
      "root [0-100]
      ├── section1 [0-30]
      │   ├── part1 [0-10]
      │   └── part2 [10-20]
      ├── section2 [30-60]
      │   ├── part1 [30-45]
      │   └── part2 [45-60]
      └── section3 [60-100]
          ├── part1 [60-80]
          └── part2 [80-100]
      "
    `);
});

test("should handle deep nesting with single children", () => {
  const ranges: FlattenedRange[] = [
    { rowStart: 0, rowEnd: 100, path: "level1" },
    { rowStart: 0, rowEnd: 80, path: "level1/level2" },
    { rowStart: 0, rowEnd: 60, path: "level1/level2/level3" },
    { rowStart: 0, rowEnd: 40, path: "level1/level2/level3/level4" },
    { rowStart: 0, rowEnd: 20, path: "level1/level2/level3/level4/level5" },
  ];

  const tree = new RangeTree(ranges);

  expect(printRangeTree(tree.root)).toMatchInlineSnapshot(`
      "level1 [0-100]
      └── level2 [0-80]
          └── level3 [0-60]
              └── level4 [0-40]
                  └── level5 [0-20]
      "
    `);
});

test("should handle multiple siblings at same level", () => {
  const ranges: FlattenedRange[] = [
    { rowStart: 0, rowEnd: 100, path: "root" },
    { rowStart: 0, rowEnd: 20, path: "root/A" },
    { rowStart: 20, rowEnd: 40, path: "root/B" },
    { rowStart: 40, rowEnd: 60, path: "root/C" },
    { rowStart: 60, rowEnd: 80, path: "root/D" },
    { rowStart: 80, rowEnd: 100, path: "root/E" },
  ];

  const tree = new RangeTree(ranges);

  expect(printRangeTree(tree.root)).toMatchInlineSnapshot(`
      "root [0-100]
      ├── A [0-20]
      ├── B [20-40]
      ├── C [40-60]
      ├── D [60-80]
      └── E [80-100]
      "
    `);
});

test("should handle asymmetric nesting", () => {
  const ranges: FlattenedRange[] = [
    { rowStart: 0, rowEnd: 100, path: "root" },
    { rowStart: 0, rowEnd: 60, path: "root/left" },
    { rowStart: 60, rowEnd: 100, path: "root/right" },
    { rowStart: 0, rowEnd: 30, path: "root/left/leftChild" },
    { rowStart: 30, rowEnd: 60, path: "root/left/rightChild" },
    { rowStart: 0, rowEnd: 15, path: "root/left/leftChild/deepNested" },
  ];

  const tree = new RangeTree(ranges);

  expect(printRangeTree(tree.root)).toMatchInlineSnapshot(`
      "root [0-100]
      ├── left [0-60]
      │   ├── leftChild [0-30]
      │   │   └── deepNested [0-15]
      │   └── rightChild [30-60]
      └── right [60-100]
      "
    `);
});

test("should handle single node tree", () => {
  const ranges: FlattenedRange[] = [{ rowStart: 0, rowEnd: 50, path: "solo" }];

  const tree = new RangeTree(ranges);

  expect(printRangeTree(tree.root)).toMatchInlineSnapshot(`
      "solo [0-50]
      "
    `);
});

test("should find ranges in simple hierarchical tree", () => {
  const ranges: FlattenedRange[] = [
    { rowStart: 0, rowEnd: 50, path: "root" },
    { rowStart: 0, rowEnd: 25, path: "root/leftBranch" },
    { rowStart: 25, rowEnd: 50, path: "root/rightBranch" },
    { rowStart: 0, rowEnd: 10, path: "root/leftBranch/leaf1" },
    { rowStart: 25, rowEnd: 35, path: "root/rightBranch/leaf2" },
  ];

  const tree = new RangeTree(ranges);

  // Test left side of tree
  expect(tree.findRangesForRowIndex(5)).toEqual([
    { rowStart: 0, rowEnd: 50, path: "root" },
    { rowStart: 0, rowEnd: 25, path: "root/leftBranch" },
    { rowStart: 0, rowEnd: 10, path: "root/leftBranch/leaf1" },
  ]);

  // Test right side of tree
  expect(tree.findRangesForRowIndex(30)).toEqual([
    { rowStart: 0, rowEnd: 50, path: "root" },
    { rowStart: 25, rowEnd: 50, path: "root/rightBranch" },
    { rowStart: 25, rowEnd: 35, path: "root/rightBranch/leaf2" },
  ]);

  // Test index outside of leaf but inside branch
  expect(tree.findRangesForRowIndex(15)).toEqual([
    { rowStart: 0, rowEnd: 50, path: "root" },
    { rowStart: 0, rowEnd: 25, path: "root/leftBranch" },
  ]);
});

test("should find ranges in multi-level tree with siblings", () => {
  const ranges: FlattenedRange[] = [
    { rowStart: 0, rowEnd: 100, path: "root" },
    { rowStart: 0, rowEnd: 30, path: "root/section1" },
    { rowStart: 30, rowEnd: 60, path: "root/section2" },
    { rowStart: 60, rowEnd: 100, path: "root/section3" },
    { rowStart: 0, rowEnd: 10, path: "root/section1/part1" },
    { rowStart: 10, rowEnd: 20, path: "root/section1/part2" },
    { rowStart: 30, rowEnd: 45, path: "root/section2/part1" },
    { rowStart: 45, rowEnd: 60, path: "root/section2/part2" },
    { rowStart: 60, rowEnd: 80, path: "root/section3/part1" },
    { rowStart: 80, rowEnd: 100, path: "root/section3/part2" },
  ];

  const tree = new RangeTree(ranges);

  // Test in first section, first part
  expect(tree.findRangesForRowIndex(5)).toEqual([
    { rowStart: 0, rowEnd: 100, path: "root" },
    { rowStart: 0, rowEnd: 30, path: "root/section1" },
    { rowStart: 0, rowEnd: 10, path: "root/section1/part1" },
  ]);

  // Test in second section, second part
  expect(tree.findRangesForRowIndex(50)).toEqual([
    { rowStart: 0, rowEnd: 100, path: "root" },
    { rowStart: 30, rowEnd: 60, path: "root/section2" },
    { rowStart: 45, rowEnd: 60, path: "root/section2/part2" },
  ]);

  // Test in gap between parts
  expect(tree.findRangesForRowIndex(25)).toEqual([
    { rowStart: 0, rowEnd: 100, path: "root" },
    { rowStart: 0, rowEnd: 30, path: "root/section1" },
  ]);
});

test("should find ranges in deeply nested tree", () => {
  const ranges: FlattenedRange[] = [
    { rowStart: 0, rowEnd: 100, path: "level1" },
    { rowStart: 0, rowEnd: 80, path: "level1/level2" },
    { rowStart: 0, rowEnd: 60, path: "level1/level2/level3" },
    { rowStart: 0, rowEnd: 40, path: "level1/level2/level3/level4" },
    { rowStart: 0, rowEnd: 20, path: "level1/level2/level3/level4/level5" },
  ];

  const tree = new RangeTree(ranges);

  // Test deep nesting
  expect(tree.findRangesForRowIndex(10)).toEqual([
    { rowStart: 0, rowEnd: 100, path: "level1" },
    { rowStart: 0, rowEnd: 80, path: "level1/level2" },
    { rowStart: 0, rowEnd: 60, path: "level1/level2/level3" },
    { rowStart: 0, rowEnd: 40, path: "level1/level2/level3/level4" },
    { rowStart: 0, rowEnd: 20, path: "level1/level2/level3/level4/level5" },
  ]);

  // Test partial depth
  expect(tree.findRangesForRowIndex(30)).toEqual([
    { rowStart: 0, rowEnd: 100, path: "level1" },
    { rowStart: 0, rowEnd: 80, path: "level1/level2" },
    { rowStart: 0, rowEnd: 60, path: "level1/level2/level3" },
    { rowStart: 0, rowEnd: 40, path: "level1/level2/level3/level4" },
  ]);

  // Test at outer level
  expect(tree.findRangesForRowIndex(80)).toEqual([{ rowStart: 0, rowEnd: 100, path: "level1" }]);
});

test("should handle edge cases for findRangesForRowIndex", () => {
  const ranges: FlattenedRange[] = [
    { rowStart: 0, rowEnd: 50, path: "root" },
    { rowStart: 0, rowEnd: 25, path: "root/left" },
    { rowStart: 25, rowEnd: 50, path: "root/right" },
  ];

  const tree = new RangeTree(ranges);

  // Test at start boundary
  expect(tree.findRangesForRowIndex(0)).toEqual([
    { rowStart: 0, rowEnd: 50, path: "root" },
    { rowStart: 0, rowEnd: 25, path: "root/left" },
  ]);

  // Test at end boundary (should return empty as end is exclusive)
  expect(tree.findRangesForRowIndex(50)).toEqual([]);

  // Test at split point between ranges
  expect(tree.findRangesForRowIndex(25)).toEqual([
    { rowStart: 0, rowEnd: 50, path: "root" },
    { rowStart: 25, rowEnd: 50, path: "root/right" },
  ]);

  // Test outside of all ranges
  expect(tree.findRangesForRowIndex(100)).toEqual([]);
  expect(tree.findRangesForRowIndex(-1)).toEqual([]);
});
