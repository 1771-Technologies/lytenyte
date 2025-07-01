export function getSlugPath(filePath: string) {
  const parts = filePath
    .split("/")
    .map((c) => {
      if (!c.startsWith("(")) return c;

      const parts = c.split(".");
      if (parts.length === 1) return "";

      return parts[1];
    })
    .filter(Boolean);

  const filename = parts.pop()!;
  const filenameParts = filename.split(".");
  filenameParts.pop();
  const pageName = filenameParts.join(".");

  parts.push(pageName);

  return parts.map((c) => (c === "index" ? "/" : c));
}
