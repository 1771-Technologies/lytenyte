import frames from "playframe";

const entries = Object.entries(frames);

interface ParentNode<T> {
  readonly kind: "parent";
  readonly name: string;
  readonly children: Record<string, ParentNode<T> | LeafNode<T>>;
}

interface LeafNode<T> {
  readonly kind: "leaf";
  readonly name: string;
  readonly path: string;
  readonly data: T;
}

const tree: Record<string, ParentNode<(typeof entries)[1]> | LeafNode<(typeof entries)[1]>> = {};

for (const [path, value] of entries) {
  const partsRaw = path.split("/");
  const parts = partsRaw.filter((x, i) => {
    if (i === partsRaw.length - 1) return true;

    return x.startsWith("[");
  });

  let current: any = tree;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!current[part]) {
      if (i === parts.length - 1)
        current[part] = {
          kind: "leaf",
          data: value,
          name: part.replace("[", "").replace("]", "").replace(".play.tsx", ""),
          path,
        };
      else
        current[part] = {
          kind: "parent",
          children: {},
          name: part.replace("[", "").replace("]", ""),
        };
    }
    current = current[part].children;
  }
}

export type Tree = typeof tree;

export { tree };
