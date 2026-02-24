import frames from "playframe";
import { capitalize } from "es-toolkit";

export type BranchNode<V> = {
  kind: "branch";
  label: string;
  children: Node<V>[];
};

export type LeafNode<V> = {
  kind: "leaf";
  label: string;
  filePath: string;
  value: V;
};

export type Node<V> = BranchNode<V> | LeafNode<V>;

export function buildFileTree<V>(files: Record<string, V>): Node<V>[] {
  const roots: Node<V>[] = [];

  // Map per siblings array to dedupe branches at that level
  const branchIndexBySiblings = new WeakMap<Node<V>[], Map<string, BranchNode<V>>>();

  const getOrCreateBranch = (siblings: Node<V>[], label: string): BranchNode<V> => {
    let idx = branchIndexBySiblings.get(siblings);
    if (!idx) {
      idx = new Map();
      branchIndexBySiblings.set(siblings, idx);
    }
    const existing = idx.get(label);
    if (existing) return existing;

    const branch: BranchNode<V> = {
      kind: "branch",
      label: label
        .replaceAll("-", " ")
        .replaceAll("_", " ")
        .split(" ")
        .map((x) => capitalize(x))
        .join(" "),
      children: [],
    };
    siblings.push(branch);
    idx.set(label, branch);
    return branch;
  };

  for (const filePath of Object.keys(files)) {
    const branches = extractParenBranches(filePath);
    const leafLabel = leafLabelFromPath(filePath);

    let siblings = roots;
    for (const b of branches) {
      const branch = getOrCreateBranch(siblings, b);
      siblings = branch.children;
    }

    siblings.push({
      kind: "leaf",
      label: leafLabel
        .replaceAll("-", " ")
        .replaceAll("_", " ")
        .split(" ")
        .map((x) => capitalize(x))
        .join(" "),
      filePath,
      value: files[filePath],
    });
  }

  return roots;
}

function extractParenBranches(filePath: string): string[] {
  const out: string[] = [];
  const re = /\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(filePath)) !== null) out.push(m[1]);
  return out;
}

function leafLabelFromPath(filePath: string): string {
  const base = basenamePosix(filePath);
  const noExt = stripLastExtension(base);
  return stripTrailingPlay(noExt);
}

function basenamePosix(p: string): string {
  const normalized = p.replace(/\\/g, "/");
  const i = normalized.lastIndexOf("/");
  return i === -1 ? normalized : normalized.slice(i + 1);
}

function stripLastExtension(fileName: string): string {
  const i = fileName.lastIndexOf(".");
  return i <= 0 ? fileName : fileName.slice(0, i);
}

function stripTrailingPlay(stem: string): string {
  return stem.toLowerCase().endsWith(".play") ? stem.slice(0, -5) : stem;
}

export const forest = buildFileTree(frames);

export const flatDemos: LeafNode<any>[] = [];

const stack = [...forest];
while (stack.length) {
  const next = stack.pop()!;
  if (next.kind === "branch") {
    stack.push(...next.children);
  } else {
    flatDemos.push(next);
  }
}
