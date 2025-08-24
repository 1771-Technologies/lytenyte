import frames from "playframe";

const keys = Object.keys(frames);

export type Demo = { value: string; label: string; path: string[] };

export const demoOptions = keys.map((key) => {
  const filename = key.split("/").at(-1)!.replaceAll(".tsx", "");

  const path = key
    .split("/")
    .filter((x) => x.startsWith("[") && x.endsWith("]"))
    .map((c) => c.slice(1, -1));

  const parts = filename.split(".");
  const playPart = parts.pop()!;

  if (playPart.includes("(")) {
    const name = playPart.split(")").at(0)!.replace("(", "");

    return { value: key, label: name, path };
  }
  const demoName = parts.join(".");
  return { value: key, label: demoName, path };
});

type Branch = { kind: "branch"; children: Map<string | number, Branch | Leaf>; label: string };
type Leaf = { kind: "leaf"; node: Demo };

const tree: Branch = { kind: "branch", children: new Map(), label: "__root__" };

demoOptions.forEach((c, i) => {
  let current = tree;

  for (const p of c.path) {
    if (!current.children.has(p)) {
      current.children.set(p, { kind: "branch", children: new Map(), label: p });
    }
    current = current.children.get(p)! as Branch;
  }

  current.children.set(i, { kind: "leaf", node: c });
});

export const trees = [...tree.children.values()];
