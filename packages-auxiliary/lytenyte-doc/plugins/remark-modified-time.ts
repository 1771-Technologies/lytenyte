import type { Plugin } from "unified";
import type { Root } from "mdast";
import type { VFile } from "vfile";
import { stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

type AstroData = {
  astro?: {
    frontmatter: Record<string, unknown>;
  };
};

const cache = new Map<string, string>();

async function getGitCommitTimeISO(absPath: string): Promise<string | null> {
  try {
    // %cI = committer date, strict ISO 8601
    const { stdout } = await execFileAsync("git", ["log", "-1", "--format=%cI", "--", absPath]);

    const iso = stdout.trim();
    return iso ? iso : null;
  } catch {
    // Happens when file is untracked, git not installed, not in a repo, etc.
    return null;
  }
}

export const remarkLastModified: Plugin<[], Root> = () => {
  return async (_tree: Root, file: VFile) => {
    const filepath = file.history?.[0];
    if (!filepath) return;

    if (cache.has(filepath)) {
      const data = file.data as AstroData;
      data.astro ??= { frontmatter: {} };
      data.astro.frontmatter.lastModified = cache.get(filepath)!;
      data.astro.frontmatter.lastModifiedSource = "git";
      return;
    }

    const gitISO = await getGitCommitTimeISO(filepath);

    let iso: string;
    let source: "git" | "fs";

    if (gitISO) {
      iso = gitISO;
      source = "git";
    } else {
      const { mtime } = await stat(filepath);
      iso = mtime.toISOString();
      source = "fs";
    }

    cache.set(filepath, iso);

    const data = file.data as AstroData;
    data.astro ??= { frontmatter: {} };
    data.astro.frontmatter.lastModified = iso;
    data.astro.frontmatter.lastModifiedSource = source; // optional, but handy
  };
};
