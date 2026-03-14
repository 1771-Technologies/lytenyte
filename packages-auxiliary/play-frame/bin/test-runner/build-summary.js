function countTests(nodes) {
  let passed = 0, failed = 0, total = 0;
  for (const node of nodes) {
    if (node.kind === "test") {
      total++;
      if (node.state === "passed") passed++;
      else if (node.state === "failed") failed++;
    } else if (node.kind === "suite") {
      const sub = countTests(node.children);
      passed += sub.passed;
      failed += sub.failed;
      total += sub.total;
    }
  }
  return { passed, failed, total };
}

export function buildSummary(modules) {
  let passed = 0, failed = 0, total = 0;
  for (const mod of modules) {
    const counts = countTests(mod.nodes);
    passed += counts.passed;
    failed += counts.failed;
    total += counts.total;
  }
  return { success: failed === 0, numPassed: passed, numFailed: failed, numTotal: total };
}
