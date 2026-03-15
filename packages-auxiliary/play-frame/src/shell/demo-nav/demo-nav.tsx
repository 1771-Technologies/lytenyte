import { useState } from "react";
import { Flex, Text } from "@radix-ui/themes";
import { ChevronRightIcon, ChevronDownIcon, FileIcon } from "@radix-ui/react-icons";
import type { Demo } from "../demo-dropdown/demo-dropdown.js";
import { forest } from "../demo-dropdown/demo-tree.js";
import type { BranchNode, LeafNode, Node } from "../demo-dropdown/demo-tree.js";

// ─── folder icons ─────────────────────────────────────────────────────────────

function FolderClosedIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={style}>
      <path d="M5.5 2a.5.5 0 0 0-.354.146L3.793 3.5H1.5A1.5 1.5 0 0 0 0 5v7a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 12V5a1.5 1.5 0 0 0-1.5-1.5H8.207L6.854 2.146A.5.5 0 0 0 6.5 2h-1z" />
    </svg>
  );
}

function FolderOpenIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={style}>
      <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2H6a.5.5 0 0 1 .354.146L7.707 3.5H14.5A1.5 1.5 0 0 1 16 5v.5H1V5a1.5 1.5 0 0 1 0-1.5z" />
      <path d="M.034 8.62A1.5 1.5 0 0 1 1.5 7.5h13a1.5 1.5 0 0 1 1.487 1.308l-.5 4A1.5 1.5 0 0 1 14 14.5H2a1.5 1.5 0 0 1-1.487-1.192l-.5-4A1.5 1.5 0 0 1 .034 8.62z" />
    </svg>
  );
}

// ─── branch node ──────────────────────────────────────────────────────────────

function BranchView({
  node,
  current,
  onSelect,
  depth,
}: {
  node: BranchNode<any>;
  current: Demo | null;
  onSelect: (d: Demo) => void;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Flex direction="column">
      <Flex
        align="center"
        gap="1"
        py="1"
        style={{ paddingLeft: depth * 16 + 8, cursor: "pointer", borderRadius: "var(--radius-2)" }}
        onClick={() => setExpanded((e) => !e)}
        className="demo-nav-row"
      >
        {expanded ? (
          <ChevronDownIcon style={{ flexShrink: 0, width: 16, height: 16 }} />
        ) : (
          <ChevronRightIcon style={{ flexShrink: 0, width: 16, height: 16 }} />
        )}
        {expanded ? (
          <FolderOpenIcon style={{ flexShrink: 0, color: "var(--amber-9)" }} />
        ) : (
          <FolderClosedIcon style={{ flexShrink: 0, color: "var(--amber-9)" }} />
        )}
        <Text size="1" weight="medium" style={{ userSelect: "none" }}>
          {node.label}
        </Text>
      </Flex>
      {expanded &&
        node.children.map((child, i) => (
          <NodeView key={i} node={child} current={current} onSelect={onSelect} depth={depth + 1} />
        ))}
    </Flex>
  );
}

// ─── leaf node ────────────────────────────────────────────────────────────────

// paddingLeft accounts for the missing chevron (16px) + gap (4px) so the
// file icon aligns horizontally with the folder icon in branch rows.
const LEAF_CHEVRON_OFFSET = 20;

function LeafView({
  node,
  current,
  onSelect,
  depth,
}: {
  node: LeafNode<any>;
  current: Demo | null;
  onSelect: (d: Demo) => void;
  depth: number;
}) {
  const isSelected = node.filePath === current?.filePath;

  return (
    <Flex
      align="center"
      gap="1"
      py="1"
      style={{
        paddingLeft: depth * 16 + 8 + LEAF_CHEVRON_OFFSET,
        cursor: "pointer",
        borderRadius: "var(--radius-2)",
        background: isSelected ? "var(--accent-a3)" : undefined,
      }}
      onClick={() => onSelect({ value: node.value, label: node.label, filePath: node.filePath })}
      className={isSelected ? undefined : "demo-nav-row"}
    >
      <FileIcon style={{ flexShrink: 0, width: 14, height: 14, color: "var(--violet-9)" }} />
      <Text size="1" style={{ userSelect: "none" }}>
        {node.label}
      </Text>
    </Flex>
  );
}

// ─── node dispatcher ──────────────────────────────────────────────────────────

function NodeView({
  node,
  current,
  onSelect,
  depth,
}: {
  node: Node<any>;
  current: Demo | null;
  onSelect: (d: Demo) => void;
  depth: number;
}) {
  if (node.kind === "branch") {
    return <BranchView node={node} current={current} onSelect={onSelect} depth={depth} />;
  }
  return <LeafView node={node} current={current} onSelect={onSelect} depth={depth} />;
}

// ─── public export ────────────────────────────────────────────────────────────

export interface DemoNavProps {
  current: Demo | null;
  onSelect: (demo: Demo) => void;
}

export function DemoNav({ current, onSelect }: DemoNavProps) {
  return (
    <Flex
      direction="column"
      py="2"
      px="1"
      style={{ minWidth: 240, flexShrink: 0 }}
    >
      {forest.map((node, i) => (
        <NodeView key={i} node={node} current={current} onSelect={onSelect} depth={0} />
      ))}
    </Flex>
  );
}
