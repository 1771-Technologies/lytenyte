import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { PNG } from "pngjs";
import path, { dirname } from "path";
import type { BrowserCommand } from "vitest/node";
import pixelmatch from "pixelmatch";

export const existsFile: BrowserCommand<[arg1: string]> = ({ testPath, provider }, src) => {
  if (provider.name === "playwright") {
    const dir = dirname(testPath!);
    return existsSync(path.join(dir, src));
  }

  throw new Error(`provider ${provider.name} is not supported`);
};

export const getPlatform: BrowserCommand<[]> = () => {
  return process.platform;
};

export const compareImages: BrowserCommand<[left: string, right: string]> = (
  { testPath, provider },
  left,
  right,
) => {
  if (provider.name === "playwright") {
    const dir = dirname(testPath!);

    const img1 = PNG.sync.read(readFileSync(path.join(dir, left)));
    const img2 = PNG.sync.read(readFileSync(path.join(dir, right)));
    const { width, height } = img1;
    const diff = new PNG({ width, height });

    let result;
    try {
      // @ts-expect-error types conflicting with other node types, but this works.
      result = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.05 });
    } catch (e: any) {
      if (!e.message?.includes("Image sizes do not match")) {
        console.error(e.message);
      }

      result = 1;
    }

    const fileName = left.split("/").at(-1)!.replace(".png", "");

    if (existsSync(`${dir}/(snap-diff)/${fileName}-diff.png`))
      rmSync(`${dir}/(snap-diff)/${fileName}-diff.png`);

    if (result !== 0) {
      if (!existsSync(`${dir}/(snap-diff)`)) mkdirSync(`${dir}/(snap-diff)`);
      // @ts-expect-error types conflicting with other node types, but this works.
      writeFileSync(`${dir}/(snap-diff)/${fileName}-diff.png`, PNG.sync.write(diff));
    }

    return result === 0;
  }

  throw new Error(`provider ${provider.name} is not supported`);
};
