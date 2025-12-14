import fs from "fs";

export function getRoot(path: string): { root: true; path: string; pages?: string[] } {
  const parts = path.split("/");

  for (let i = parts.length - 1; i >= 0; i--) {
    const subfolder = `${parts.slice(0, i).join("/")}/meta.json`;

    if (fs.existsSync(subfolder)) {
      const file = JSON.parse(fs.readFileSync(subfolder, "utf-8"));
      if (file.root) return { ...file, path: parts.slice(0, i).join("/") };
    }
  }

  return {
    path: parts[0],
    root: true,
  };
}
