import type { TestFileResult, TestNode } from "./use-run-tests.js";

function countNodes(nodes: TestNode[]): { total: number; passed: number; failed: number } {
  let total = 0, passed = 0, failed = 0;
  for (const node of nodes) {
    if (node.kind === "test") {
      total++;
      if (node.state === "passed") passed++;
      else if (node.state === "failed") failed++;
    } else {
      const sub = countNodes(node.children);
      total += sub.total;
      passed += sub.passed;
      failed += sub.failed;
    }
  }
  return { total, passed, failed };
}

export function projectCounts(mods: TestFileResult[]) {
  return mods.reduce(
    (acc, mod) => {
      const c = countNodes(mod.nodes);
      return { total: acc.total + c.total, passed: acc.passed + c.passed, failed: acc.failed + c.failed };
    },
    { total: 0, passed: 0, failed: 0 },
  );
}
