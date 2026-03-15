import { readFile } from "node:fs/promises";
import { relative } from "node:path";

function computeLineCoverage(istanbulFile) {
  const lineCounts = new Map();
  for (const [id, loc] of Object.entries(istanbulFile.statementMap)) {
    const count = istanbulFile.s[id] ?? 0;
    for (let line = loc.start.line; line <= loc.end.line; line++) {
      const existing = lineCounts.get(line);
      lineCounts.set(line, existing === undefined ? count : Math.max(existing, count));
    }
  }
  return [...lineCounts.entries()]
    .map(([line, count]) => ({ line, count }))
    .sort((a, b) => a.line - b.line);
}

function computeSummary(istanbulFile) {
  const s = Object.values(istanbulFile.s);
  const f = Object.values(istanbulFile.f);
  const b = Object.values(istanbulFile.b).flat();

  const lineSet = new Set();
  const coveredLineSet = new Set();
  for (const [id, loc] of Object.entries(istanbulFile.statementMap)) {
    for (let l = loc.start.line; l <= loc.end.line; l++) lineSet.add(l);
    if ((istanbulFile.s[id] ?? 0) > 0) {
      for (let l = loc.start.line; l <= loc.end.line; l++) coveredLineSet.add(l);
    }
  }

  const pct = (covered, total) =>
    total === 0 ? 100 : Math.round((covered / total) * 1000) / 10;

  const stmtCovered = s.filter((c) => c > 0).length;
  const fnCovered = f.filter((c) => c > 0).length;
  const branchCovered = b.filter((c) => c > 0).length;

  return {
    statements: { total: s.length, covered: stmtCovered, pct: pct(stmtCovered, s.length) },
    functions: { total: f.length, covered: fnCovered, pct: pct(fnCovered, f.length) },
    branches: { total: b.length, covered: branchCovered, pct: pct(branchCovered, b.length) },
    lines: {
      total: lineSet.size,
      covered: coveredLineSet.size,
      pct: pct(coveredLineSet.size, lineSet.size),
    },
  };
}

function computeUncoveredRanges(istanbulFile) {
  const ranges = [];

  for (const [id, loc] of Object.entries(istanbulFile.statementMap)) {
    if ((istanbulFile.s[id] ?? 0) === 0) {
      ranges.push({ startLine: loc.start.line, startCol: loc.start.column, endLine: loc.end.line, endCol: loc.end.column, type: "statement" });
    }
  }

  for (const [id, fn] of Object.entries(istanbulFile.fnMap ?? {})) {
    if ((istanbulFile.f[id] ?? 0) === 0) {
      const loc = fn.decl ?? fn.loc;
      if (loc?.start?.line > 0) {
        ranges.push({ startLine: loc.start.line, startCol: loc.start.column, endLine: loc.end.line, endCol: loc.end.column, type: "function" });
      }
    }
  }

  for (const [id, branch] of Object.entries(istanbulFile.branchMap ?? {})) {
    const counts = istanbulFile.b[id] ?? [];
    for (let i = 0; i < branch.locations.length; i++) {
      if ((counts[i] ?? 0) === 0) {
        const loc = branch.locations[i];
        // Skip implicit else branches with no real source location
        if (loc?.start?.line > 0 && (loc.start.line !== loc.end.line || loc.start.column !== loc.end.column)) {
          ranges.push({ startLine: loc.start.line, startCol: loc.start.column, endLine: loc.end.line, endCol: loc.end.column, type: "branch" });
        }
      }
    }
  }

  return ranges;
}

export async function buildCoverageResult(istanbulJson, cwd) {
  const files = [];

  for (const [absPath, data] of Object.entries(istanbulJson)) {
    let source;
    try {
      source = await readFile(absPath, "utf-8");
    } catch {
      continue;
    }
    files.push({
      path: relative(cwd, absPath),
      source,
      lines: computeLineCoverage(data),
      summary: computeSummary(data),
      uncoveredRanges: computeUncoveredRanges(data),
    });
  }

  files.sort((a, b) => a.path.localeCompare(b.path));

  let stmtTotal = 0, stmtCovered = 0;
  let fnTotal = 0, fnCovered = 0;
  let branchTotal = 0, branchCovered = 0;
  let lineTotal = 0, lineCovered = 0;

  for (const f of files) {
    stmtTotal += f.summary.statements.total;
    stmtCovered += f.summary.statements.covered;
    fnTotal += f.summary.functions.total;
    fnCovered += f.summary.functions.covered;
    branchTotal += f.summary.branches.total;
    branchCovered += f.summary.branches.covered;
    lineTotal += f.summary.lines.total;
    lineCovered += f.summary.lines.covered;
  }

  const pct = (covered, total) =>
    total === 0 ? 100 : Math.round((covered / total) * 1000) / 10;

  return {
    files,
    summary: {
      statements: { total: stmtTotal, covered: stmtCovered, pct: pct(stmtCovered, stmtTotal) },
      functions: { total: fnTotal, covered: fnCovered, pct: pct(fnCovered, fnTotal) },
      branches: { total: branchTotal, covered: branchCovered, pct: pct(branchCovered, branchTotal) },
      lines: { total: lineTotal, covered: lineCovered, pct: pct(lineCovered, lineTotal) },
    },
  };
}
