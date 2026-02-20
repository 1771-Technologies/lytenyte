import type { Loader, LoaderContext } from "astro/loaders";
import { globby as glob } from "globby";
import { z } from "astro/zod";
import path from "node:path";

export function playloader(options: { base: string }): Loader {
  return {
    name: "playloader",

    load: async (l: LoaderContext): Promise<void> => {
      let prev: string[] = [];
      const update = async () => {
        const playFiles = await glob("**/*.play.*", { cwd: options.base });
        const toRemove = prev.filter((x) => !playFiles.includes(x));
        prev = playFiles;

        toRemove.forEach((x) => l.store.delete(x));
        playFiles.forEach((x) => {
          l.store.set({
            id: x,
            data: {
              filePath: path.resolve(options.base, "./" + x),
            },
          });
        });
      };
      update();

      l.watcher?.add(options.base);
      l.watcher?.on("add", async (change) => {
        if (!change.includes(".play.")) return;
        update();
      });
      l.watcher?.on("unlink", async (change) => {
        if (!change.includes(".play.")) return;
        update();
      });
    },
    schema: async () => z.object({}),
  };
}
