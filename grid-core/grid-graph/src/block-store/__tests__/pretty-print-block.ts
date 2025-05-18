import type { Block, BlockPaths } from "../../types.js";

export function prettyPrintBlockPaths<D>(blockPaths: BlockPaths<D>): string {
  // First, build a tree structure
  const tree = new Map<string, Set<string>>();
  const allPaths = Array.from(blockPaths.keys());

  // Build parent-child relationships
  allPaths.forEach((path) => {
    const parts = path.split("/");
    if (parts.length > 1) {
      const parent = parts.slice(0, -1).join("/");
      if (!tree.has(parent)) {
        tree.set(parent, new Set());
      }
      tree.get(parent)!.add(path);
    }
  });

  // Format headers
  const output: string[] = [];
  output.push("PATH".padEnd(30) + "BLOCKS".padEnd(10) + "SIZE".padEnd(10) + "DATA");
  output.push("─".repeat(80));

  // Helper to print block data concisely
  const formatBlockData = (block: Block<D>): string => {
    return `[${block.data.map((node) => `${node.kind}:${(node as any).pathKey || '""'}`).join(", ")}]`;
  };

  // Recursive function to print paths
  const printPath = (path: string, level: number = 0): void => {
    const store = blockPaths.get(path);
    if (!store) return;

    // Format the current path with indentation
    const indent = "  ".repeat(level);
    const displayPath = `${indent}${path}`;

    // Get block information
    const blockCount = store.map.size;
    const blocks: string[] = [];

    store.map.forEach((block, key) => {
      blocks.push(`${key}=${formatBlockData(block)}`);
    });

    // Add the main line
    output.push(
      displayPath.padEnd(30) +
        String(blockCount).padEnd(10) +
        String(store.size).padEnd(10) +
        blocks.join(", "),
    );

    // Process children
    const children = tree.get(path) || new Set();
    children.forEach((childPath) => {
      printPath(childPath, level + 1);
    });
  };

  // Start with root paths (those without parents)
  const rootPaths = allPaths.filter((path) => !path.includes("/"));
  rootPaths.forEach((path) => printPath(path));

  return output.join("\n");
}
