/**
 * Adds ln__total rows at every dimension level (except the measure/leaf),
 * plus ln__grand_total rows at the top level, for every distinct leaf.
 *
 * Rules:
 * - Paths are split by "-->" (whitespace around segments is trimmed).
 * - The last segment is treated as the "leaf" (e.g., measure name).
 * - For every prefix group, we add a total row by replacing the next segment
 *   with ln__total and then appending the leaf.
 *   Example: A-->B-->C-->Leaf
 *     - A-->B-->ln__total-->Leaf     (totals across C within A,B)
 *     - A-->ln__total-->Leaf         (totals across B,C within A)
 * - For each distinct leaf, we add ln__grand_total-->Leaf.
 * - Output is ordered alphabetically (case-insensitive) within each group,
 *   with ln__total rows placed after non-total rows at the same grouping level,
 *   and ln__grand_total rows at the end.
 */
export function pivotPathsWithTotals(paths: string[], measures: string[]): string[] {
  const SEP = "-->";
  const TOTAL = "ln__total";
  const GRAND = "ln__grand_total";

  // ---- Parse + normalize ----
  const parsed = paths
    .map((p) =>
      p
        .split(SEP)
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    )
    .filter((parts) => parts.length >= 2); // need at least [dim, leaf]

  if (parsed.length === 0) return [];

  // Leaf is always last segment
  const leaves = new Set<string>();
  for (const parts of parsed) leaves.add(parts[parts.length - 1]);

  // Use a Set for de-duping output
  const out = new Set<string>();

  // Always include original paths (normalized)
  for (const parts of parsed) out.add(parts.join(SEP));

  // ---- Build totals at every dimension level (except the leaf) ----
  //
  // For a path: d0 -> d1 -> ... -> d(n-2) -> leaf
  // We add totals at levels i = n-2 down to 1, producing:
  //   d0 -> ... -> d(i-1) -> TOTAL -> leaf
  //
  // (No group-total at level 0, since that's the grand total.)
  const prefixesByLenAndLeaf = new Map<string, Set<string>>();
  // key: `${i}|${leaf}` where i is the prefix length (number of dims to keep, >=1)
  // value: set of serialized prefixes (dims only, no leaf)

  for (const parts of parsed) {
    const leaf = parts[parts.length - 1];
    const dims = parts.slice(0, -1); // all but leaf

    // Consider all prefix lengths from 1..dims.length (we'll add totals below the prefix)
    // For totals we need at least 1 kept dim, and at least one dim below it to total across.
    // Example: dims length = 1 => no per-group totals possible.
    for (let keep = 1; keep < dims.length; keep++) {
      const prefix = dims.slice(0, keep).join(SEP);
      const k = `${keep}|${leaf}`;
      if (!prefixesByLenAndLeaf.has(k)) prefixesByLenAndLeaf.set(k, new Set());
      prefixesByLenAndLeaf.get(k)!.add(prefix);
    }
  }

  // Create total rows
  for (const [key, prefixes] of prefixesByLenAndLeaf.entries()) {
    const [, leaf] = key.split("|");
    for (const prefix of prefixes) {
      out.add(`${prefix}${SEP}${TOTAL}${SEP}${leaf}`);
    }
  }

  // Also add "top level totals" like: d0 -> TOTAL -> leaf
  // This is already covered by keep=1 when dims.length >= 2.

  // ---- Grand totals per leaf ----
  for (const leaf of leaves) {
    out.add(`${GRAND}${SEP}${leaf}`);
  }

  // ---- Sorting rules ----
  // We want:
  // - Alphabetical ordering (case-insensitive) at each level
  // - ln__total should come after normal values at the same level
  // - ln__grand_total should come last overall
  //
  // We'll implement a comparator over the whole path that enforces:
  // 1) GRAND always last
  // 2) Otherwise compare segment-by-segment:
  //    - At any segment, non-TOTAL comes before TOTAL
  //    - Then alphabetical (case-insensitive), with a stable tie-breaker on raw
  // 3) If one path is prefix of another, shorter first
  const sortKey = (seg: string): [number, string, string] => {
    if (seg === TOTAL) return [1, seg.toLowerCase(), seg];
    return [0, seg.toLowerCase(), seg];
  };

  const tieIndex = Object.fromEntries(measures.map((x, i) => [x.toLowerCase(), i]));
  const cmp = (a: string, b: string): number => {
    const aParts = a.split(SEP).map((s) => s.trim());
    const bParts = b.split(SEP).map((s) => s.trim());

    const aIsGrand = aParts[0] === GRAND;
    const bIsGrand = bParts[0] === GRAND;
    if (aIsGrand && !bIsGrand) return 1;
    if (!aIsGrand && bIsGrand) return -1;

    const len = Math.max(aParts.length, bParts.length);
    for (let i = 0; i < len; i++) {
      const as = aParts[i];
      const bs = bParts[i];
      if (as === undefined) return -1;
      if (bs === undefined) return 1;

      const ak = sortKey(as);
      const bk = sortKey(bs);

      // total positioning
      if (ak[0] !== bk[0]) return ak[0] - bk[0];

      // Tie break at leaf
      if (i === aParts.length - 1 && i === bParts.length - 1) {
        const left = tieIndex[ak[1]];
        const right = tieIndex[bk[1]];

        if (left < right) return -1;
        if (left > right) return 1;
      }

      // case-insensitive alphabetical
      if (ak[1] < bk[1]) return -1;
      if (ak[1] > bk[1]) return 1;

      // raw tie-breaker
      if (ak[2] < bk[2]) return -1;
      if (ak[2] > bk[2]) return 1;
    }
    return 0;
  };

  return Array.from(out).sort(cmp);
}
