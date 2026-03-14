function buildTestTree(collection) {
  const nodes = [];
  for (const item of collection) {
    if (item.type === "suite") {
      nodes.push({
        kind: "suite",
        name: item.name,
        state: item.state(),
        children: buildTestTree(item.children),
      });
    } else if (item.type === "test") {
      const result = item.result();
      nodes.push({
        kind: "test",
        name: item.name,
        fullName: item.fullName,
        state: result?.state ?? "pending",
        duration: item.diagnostic?.()?.duration,
        errors: result?.errors?.map((e) => e.message ?? String(e)) ?? [],
      });
    }
  }
  return nodes;
}

export function buildTestFileResult(testModule) {
  return {
    filepath: testModule.moduleId,
    projectName: testModule.project?.name ?? "",
    state: testModule.state(),
    nodes: buildTestTree(testModule.children),
  };
}
