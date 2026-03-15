import { useState } from "react";
import { Badge, Flex, Text } from "@radix-ui/themes";
import { ChevronRightIcon, ChevronDownIcon, FileIcon } from "@radix-ui/react-icons";
import type { CoverageResult, FileCoverageData, FileCoverageSummary, UncoveredRange } from "./use-run-tests.js";

// ─── folder icons (not in @radix-ui/react-icons) ─────────────────────────────

function FolderClosedIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={style}>
      <path d="M5.5 2a.5.5 0 0 0-.354.146L3.793 3.5H1.5A1.5 1.5 0 0 0 0 5v7a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 12V5a1.5 1.5 0 0 0-1.5-1.5H8.207L6.854 2.146A.5.5 0 0 0 6.5 2h-1z" />
    </svg>
  );
}

function FolderOpenIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={style}>
      <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2H6a.5.5 0 0 1 .354.146L7.707 3.5H14.5A1.5 1.5 0 0 1 16 5v.5H1V5a1.5 1.5 0 0 1 0-1.5z" />
      <path d="M.034 8.62A1.5 1.5 0 0 1 1.5 7.5h13a1.5 1.5 0 0 1 1.487 1.308l-.5 4A1.5 1.5 0 0 1 14 14.5H2a1.5 1.5 0 0 1-1.487-1.192l-.5-4A1.5 1.5 0 0 1 .034 8.62z" />
    </svg>
  );
}

// ─── file type icon ───────────────────────────────────────────────────────────

const EXT_COLOR: Record<string, string> = {
  ts:   "var(--blue-9)",
  tsx:  "var(--blue-9)",
  js:   "var(--amber-9)",
  jsx:  "var(--amber-9)",
  css:  "var(--violet-9)",
  scss: "var(--violet-9)",
  json: "var(--green-9)",
  md:   "var(--gray-9)",
};

function FileTypeIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const color = EXT_COLOR[ext] ?? "var(--gray-9)";
  return <FileIcon style={{ flexShrink: 0, color }} />;
}

// ─── types ────────────────────────────────────────────────────────────────────

type DirNode = { kind: "dir"; name: string; children: TreeNode[] };
type FileNode = { kind: "file"; name: string; data: FileCoverageData };
type TreeNode = DirNode | FileNode;

// ─── helpers ──────────────────────────────────────────────────────────────────

function buildTree(files: FileCoverageData[]): TreeNode[] {
  const root: TreeNode[] = [];
  for (const file of files) {
    const parts = file.path.split("/");
    let nodes = root;
    for (let i = 0; i < parts.length - 1; i++) {
      let dir = nodes.find((n): n is DirNode => n.kind === "dir" && n.name === parts[i]);
      if (!dir) {
        dir = { kind: "dir", name: parts[i], children: [] };
        nodes.push(dir);
      }
      nodes = dir.children;
    }
    nodes.push({ kind: "file", name: parts[parts.length - 1], data: file });
  }
  return root;
}

function pctColor(pct: number): "green" | "yellow" | "red" {
  if (pct >= 80) return "green";
  if (pct >= 50) return "yellow";
  return "red";
}

// ─── segment helpers for character-level coverage highlighting ────────────────

type RangeType = "statement" | "function" | "branch";
type SegmentType = RangeType | null;

const RANGE_PRIORITY: Record<RangeType, number> = { function: 3, branch: 2, statement: 1 };

const SEGMENT_BG: Record<RangeType, string> = {
  statement: "var(--red-a7)",
  branch: "var(--amber-a7)",
  function: "var(--violet-a6)",
};

function getLineSegments(
  text: string,
  lineNum: number,
  uncoveredRanges: UncoveredRange[],
): Array<{ text: string; type: SegmentType }> {
  const lineRanges = uncoveredRanges.filter(
    (r) => r.startLine <= lineNum && r.endLine >= lineNum,
  );
  if (lineRanges.length === 0) return [{ text, type: null }];

  const charTypes: SegmentType[] = new Array(text.length).fill(null);

  for (const range of lineRanges) {
    const start = range.startLine < lineNum ? 0 : range.startCol;
    const end = range.endLine > lineNum ? text.length : Math.min(range.endCol, text.length);
    for (let i = start; i < end; i++) {
      const current = charTypes[i];
      if (current === null || RANGE_PRIORITY[range.type] > RANGE_PRIORITY[current]) {
        charTypes[i] = range.type;
      }
    }
  }

  if (text.length === 0) return [{ text: "", type: null }];

  const segments: Array<{ text: string; type: SegmentType }> = [];
  let segStart = 0;
  let segType = charTypes[0];

  for (let i = 1; i <= text.length; i++) {
    const nextType = i < text.length ? charTypes[i] : null;
    if (nextType !== segType || i === text.length) {
      segments.push({ text: text.slice(segStart, i), type: segType });
      segStart = i;
      segType = nextType;
    }
  }

  return segments;
}

// ─── coverage badge ───────────────────────────────────────────────────────────

// padStart(3) ensures the number is always 3 chars wide ("  0", " 50", "100"),
// giving every badge identical width when rendered in a monospace font.
function PctBadge({ label, pct, size = "1" }: { label: string; pct: number; size?: "1" | "2" }) {
  const text = `${label} ${String(Math.round(pct)).padStart(3)}%`;
  return (
    <Badge color={pctColor(pct)} size={size} style={{ fontFamily: "monospace" }}>
      <span style={{ whiteSpace: "pre" }}>{text}</span>
    </Badge>
  );
}

// ─── inline file summary badges ───────────────────────────────────────────────

function FileSummaryBadges({ summary }: { summary: FileCoverageSummary }) {
  return (
    <Flex gap="1" wrap="nowrap" style={{ flexShrink: 0 }}>
      <PctBadge label="Ln" pct={summary.lines.pct} />
      <PctBadge label="St" pct={summary.statements.pct} />
      <PctBadge label="Fn" pct={summary.functions.pct} />
      <PctBadge label="Br" pct={summary.branches.pct} />
    </Flex>
  );
}

// ─── coverage summary bar (top-level) ─────────────────────────────────────────

function SummaryBar({ summary }: { summary: FileCoverageSummary }) {
  return (
    <Flex gap="2" wrap="wrap">
      <PctBadge label="Ln  " pct={summary.lines.pct} size="2" />
      <PctBadge label="Stmt" pct={summary.statements.pct} size="2" />
      <PctBadge label="Fn  " pct={summary.functions.pct} size="2" />
      <PctBadge label="Br  " pct={summary.branches.pct} size="2" />
    </Flex>
  );
}

// ─── source view ──────────────────────────────────────────────────────────────

function FileSource({ data }: { data: FileCoverageData }) {
  const lineMap = new Map(data.lines.map((l) => [l.line, l.count]));
  const sourceLines = data.source.split("\n");

  return (
    <div
      style={{
        overflowX: "auto",
        fontFamily: "monospace",
        fontSize: "var(--font-size-1)",
        lineHeight: 1.6,
      }}
    >
      {sourceLines.map((text, i) => {
        const lineNum = i + 1;
        const count = lineMap.get(lineNum);
        const lineBg =
          count === undefined
            ? "transparent"
            : count > 0
              ? "var(--green-a3)"
              : "var(--red-a4)";
        const gutterColor =
          count === undefined
            ? "var(--gray-7)"
            : count > 0
              ? "var(--green-9)"
              : "var(--red-9)";

        const segments = getLineSegments(text, lineNum, data.uncoveredRanges);

        return (
          <div key={i} style={{ display: "flex", background: lineBg, minWidth: "max-content" }}>
            <span
              style={{
                minWidth: 40,
                paddingRight: 12,
                textAlign: "right",
                color: gutterColor,
                userSelect: "none",
                flexShrink: 0,
              }}
            >
              {lineNum}
            </span>
            <span style={{ whiteSpace: "pre" }}>
              {segments.map((seg, j) =>
                seg.type ? (
                  <span key={j} style={{ background: SEGMENT_BG[seg.type] }}>
                    {seg.text}
                  </span>
                ) : (
                  seg.text
                ),
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── file node ────────────────────────────────────────────────────────────────

function CoverageFileNode({ node, depth }: { node: FileNode; depth: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Flex direction="column">
      <Flex
        align="center"
        gap="2"
        py="1"
        px="2"
        style={{
          paddingLeft: depth * 16 + 8,
          cursor: "pointer",
          borderRadius: "var(--radius-2)",
        }}
        onClick={() => setExpanded((e) => !e)}
        className="coverage-row"
      >
        {expanded ? (
          <ChevronDownIcon style={{ flexShrink: 0 }} />
        ) : (
          <ChevronRightIcon style={{ flexShrink: 0 }} />
        )}
        <FileTypeIcon name={node.name} />
        <Text size="1" style={{ fontFamily: "monospace", flexGrow: 1 }}>
          {node.name}
        </Text>
        <FileSummaryBadges summary={node.data.summary} />
      </Flex>
      {expanded && (
        <div
          style={{
            marginLeft: depth * 16 + 8,
            marginBottom: 8,
            border: "1px solid var(--gray-a5)",
            borderRadius: "var(--radius-2)",
            overflow: "hidden",
          }}
        >
          <FileSource data={node.data} />
        </div>
      )}
    </Flex>
  );
}

// ─── dir node ─────────────────────────────────────────────────────────────────

function CoverageDirNode({ node, depth }: { node: DirNode; depth: number }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Flex direction="column">
      <Flex
        align="center"
        gap="2"
        py="1"
        px="2"
        style={{ paddingLeft: depth * 16 + 8, cursor: "pointer", borderRadius: "var(--radius-2)" }}
        onClick={() => setExpanded((e) => !e)}
        className="coverage-row"
      >
        {expanded ? (
          <ChevronDownIcon style={{ flexShrink: 0 }} />
        ) : (
          <ChevronRightIcon style={{ flexShrink: 0 }} />
        )}
        {expanded
          ? <FolderOpenIcon style={{ flexShrink: 0, color: "var(--amber-9)" }} />
          : <FolderClosedIcon style={{ flexShrink: 0, color: "var(--amber-9)" }} />
        }
        <Text size="1" weight="medium" style={{ fontFamily: "monospace" }}>
          {node.name}
        </Text>
      </Flex>
      {expanded && <CoverageNodeList nodes={node.children} depth={depth + 1} />}
    </Flex>
  );
}

// ─── node list ────────────────────────────────────────────────────────────────

function CoverageNodeList({ nodes, depth }: { nodes: TreeNode[]; depth: number }) {
  return (
    <>
      {nodes.map((node) =>
        node.kind === "dir" ? (
          <CoverageDirNode key={node.name} node={node} depth={depth} />
        ) : (
          <CoverageFileNode key={node.data.path} node={node} depth={depth} />
        ),
      )}
    </>
  );
}

// ─── public export ────────────────────────────────────────────────────────────

export function CoverageTree({ coverage }: { coverage: CoverageResult }) {
  const tree = buildTree(coverage.files);

  return (
    <Flex direction="column" gap="3">
      <SummaryBar summary={coverage.summary} />
      <Flex direction="column">
        <CoverageNodeList nodes={tree} depth={0} />
      </Flex>
    </Flex>
  );
}
