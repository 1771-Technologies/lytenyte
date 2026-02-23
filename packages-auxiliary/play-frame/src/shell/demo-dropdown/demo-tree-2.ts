import frames from "playframe";

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

/**
 * Build a forest (array of top-level nodes) from file paths:
 * - Branch nodes come from segments wrapped in parentheses: (Home) -> "Home"
 * - Leaf label comes from file name, stripping final extension and a trailing ".play"
 * - Leaf value is files[filePath]
 *
 * Runs in the browser (no Node.js libs).
 */
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

    const branch: BranchNode<V> = { kind: "branch", label, children: [] };
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
      label: leafLabel,
      filePath,
      value: files[filePath],
    });
  }

  return roots;
}

/** Extract "(...)" segments in order, returning the inside text. */
function extractParenBranches(filePath: string): string[] {
  const out: string[] = [];
  const re = /\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(filePath)) !== null) out.push(m[1]);
  return out;
}

/**
 * Get file name from a path, then:
 * - remove the last extension (everything after the final ".")
 * - remove a trailing ".play" if present (case-insensitive)
 */
function leafLabelFromPath(filePath: string): string {
  const base = basenamePosix(filePath); // "basic-rendering.play.tsx"
  const noExt = stripLastExtension(base); // "basic-rendering.play"
  return stripTrailingPlay(noExt); // "basic-rendering"
}

/** POSIX basename (treats "/" as separator). */
function basenamePosix(p: string): string {
  const normalized = p.replace(/\\/g, "/"); // tolerate Windows slashes just in case
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
const forest = buildFileTree(frames);

console.log(forest);
