export function joinSlugPath(path: string[]) {
  let joined = "";
  for (let i = 0; i < path.length; i++) {
    const s = path[i]!.trim();

    if (s === "/") joined += s;
    else if (!joined) joined += s;
    else if (s) joined += "/" + s;
  }

  return joined;
}
