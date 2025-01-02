import { createPathTree, type PathTreeNode } from "../path-tree.js";

// Example usage
const input = [
  { path: ["folder1", "subA", "deepA"], data: "X" },
  { path: ["folder1", "subA", "deepA"], data: "Y" },
  { path: ["folder1", "subA", "deepB"], data: "Z" },
  { path: ["folder1", "subB"], data: "W" },
  { path: ["folder1", "subA", "deepA"], data: "V" },
];

test("Should handle a basic tree", () => {
  expect(printTrees(createPathTree(input, { considerAdjacency: false }))).toMatchInlineSnapshot(`
    "
    └── folder1 [folder1#0]
        ├── subA [folder1/subA#0]
        │   ├── deepA [folder1/subA/deepA#0]
        │   │   ├── (X)
        │   │   ├── (Y)
        │   │   └── (V)
        │   └── deepB [folder1/subA/deepB#0]
        │       └── (Z)
        └── subB [folder1/subB#0]
            └── (W)
    "
  `);

  expect(printTrees(createPathTree(input, { considerAdjacency: true }))).toMatchInlineSnapshot(`
    "
    └── folder1 [folder1#0]
        ├── subA [folder1/subA#0]
        │   ├── deepA [folder1/subA/deepA#0]
        │   │   ├── (X)
        │   │   └── (Y)
        │   └── deepB [folder1/subA/deepB#0]
        │       └── (Z)
        ├── subB [folder1/subB#0]
        │   └── (W)
        └── subA [folder1/subA#1]
            └── deepA [folder1/subA/deepA#1]
                └── (V)
    "
  `);
});

test("should handle empty tree", () => {
  expect(printTrees(createPathTree([]))).toMatchInlineSnapshot(`
    "
    "
  `);
  expect(printTrees(createPathTree([], { considerAdjacency: true }))).toMatchInlineSnapshot(`
    "
    "
  `);
  expect(printTrees(createPathTree([], { considerAdjacency: false }))).toMatchInlineSnapshot(`
    "
    "
  `);
});

test("should handle a mix of branch nodes and root nodes", () => {
  const input = [
    { path: [], data: "F" },
    { path: ["folder1", "subA"], data: "X" },
    { path: ["folder1", "subA"], data: "B" },
    { path: [], data: "T" },
    { path: [], data: "Z" },
    { path: ["folder1", "subA"], data: "Z" },
  ];

  expect(printTrees(createPathTree(input))).toMatchInlineSnapshot(`
    "
    ├── (F)
    ├── folder1 [folder1#0]
    │   └── subA [folder1/subA#0]
    │       ├── (X)
    │       ├── (B)
    │       └── (Z)
    ├── (T)
    └── (Z)
    "
  `);

  expect(printTrees(createPathTree(input, { considerAdjacency: true }))).toMatchInlineSnapshot(`
    "
    ├── (F)
    ├── folder1 [folder1#0]
    │   └── subA [folder1/subA#0]
    │       ├── (X)
    │       └── (B)
    ├── (T)
    ├── (Z)
    └── folder1 [folder1#1]
        └── subA [folder1/subA#1]
            └── (Z)
    "
  `);
});

test("should check leaf path non-adjacency", () => {
  const input = [
    { path: ["folder1", "subA"], data: "A" }, // This creates a leaf
    { path: ["folder1", "subB"], data: "B" }, // This checks adjacency with subA and finds it's different
  ];
  expect(printTrees(createPathTree(input, { considerAdjacency: true }))).toMatchInlineSnapshot(`
    "
    └── folder1 [folder1#0]
        ├── subA [folder1/subA#0]
        │   └── (A)
        └── subB [folder1/subB#0]
            └── (B)
    "
  `);
});

test("should handle deep identical paths", () => {
  const input = [
    { path: ["folder1", "subA", "deepA"], data: "X" },
    { path: ["folder1", "subB"], data: "Y" },
    { path: ["folder1", "subA", "deepA"], data: "Z" },
  ];
  expect(printTrees(createPathTree(input, { considerAdjacency: false }))).toMatchInlineSnapshot(`
    "
    └── folder1 [folder1#0]
        ├── subA [folder1/subA#0]
        │   └── deepA [folder1/subA/deepA#0]
        │       ├── (X)
        │       └── (Z)
        └── subB [folder1/subB#0]
            └── (Y)
    "
  `);
});

test("should handle complex nested paths with adjacency", () => {
  const input = [
    { path: ["folder1", "subA", "deepA"], data: "X" },
    { path: ["folder1", "subA", "deepA"], data: "Y" },
    { path: ["folder1", "subB"], data: "Z" },
    { path: ["folder1", "subA", "deepA"], data: "W" },
  ];
  expect(printTrees(createPathTree(input, { considerAdjacency: true }))).toMatchInlineSnapshot(`
    "
    └── folder1 [folder1#0]
        ├── subA [folder1/subA#0]
        │   └── deepA [folder1/subA/deepA#0]
        │       ├── (X)
        │       └── (Y)
        ├── subB [folder1/subB#0]
        │   └── (Z)
        └── subA [folder1/subA#1]
            └── deepA [folder1/subA/deepA#1]
                └── (W)
    "
  `);
});

test("should check adjacency with leaf nodes", () => {
  const input = [
    { path: ["folder1"], data: "A" },
    { path: ["folder1", "subA"], data: "B" }, // This leaf node 'A' will be checked for adjacency with the next 'subA'
    { path: ["folder1", "subA"], data: "C" }, // This should be adjacent because the previous leaf shares the same path segment
  ];
  expect(printTrees(createPathTree(input, { considerAdjacency: true }))).toMatchInlineSnapshot(`
    "
    └── folder1 [folder1#0]
        ├── (A)
        └── subA [folder1/subA#0]
            ├── (B)
            └── (C)
    "
  `);
});

test("should handle mixed depth paths", () => {
  const input = [
    { path: ["folder1", "subA", "deepA"], data: "X" },
    { path: ["folder1"], data: "Y" },
    { path: ["folder1", "subA"], data: "Z" },
  ];
  expect(printTrees(createPathTree(input, { considerAdjacency: true }))).toMatchInlineSnapshot(`
    "
    ├── folder1 [folder1#0]
    │   └── subA [folder1/subA#0]
    │       └── deepA [folder1/subA/deepA#0]
    │           └── (X)
    └── folder1 [folder1#1]
        ├── (Y)
        └── subA [folder1/subA#1]
            └── (Z)
    "
  `);
});

function printTrees<T>(nodes: PathTreeNode<T>[]): string {
  let result = "";

  function printNode(node: PathTreeNode<T>, indent: string = "", isLast: boolean = true): string {
    // Create the line prefix with proper branching characters
    const prefix = indent + (isLast ? "└── " : "├── ");

    // Create the next level's indentation
    const childIndent = indent + (isLast ? "    " : "│   ");

    if (node.type === "leaf") {
      return `${prefix}(${node.data})\n`;
    } else {
      // For parent nodes, print the last part of the path and occurrence
      const name = node.path[node.path.length - 1] || "root";
      let output = `${prefix}${name} [${node.occurrence}]\n`;

      // Print all children
      node.children.forEach((child, index) => {
        const isLastChild = index === node.children.length - 1;
        output += printNode(child, childIndent, isLastChild);
      });

      return output;
    }
  }

  // Print each root node
  nodes.forEach((root, index) => {
    result += printNode(root, "", index === nodes.length - 1);
  });

  return "\n" + result;
}
