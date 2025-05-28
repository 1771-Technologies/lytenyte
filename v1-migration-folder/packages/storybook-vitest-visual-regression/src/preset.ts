import {
  SVVR_INIT_REQ,
  SVVR_INIT_RES,
  SVVR_RERUN,
  SVVR_RERUN_DONE,
  SVVR_RERUN_LOADING,
  SVVR_UPDATE,
} from "./+constants.ts";

import { $ } from "execa";
import type Channel from "storybook/internal/channels";
import type { SVVR_RERUN_EVENT, SVVR_INIT_REQ_EVENT, SVVR_INIT_RES_EVENT } from "./+types.js";
import { getScreensInFolder } from "./utils/get-screens-in-folder.ts";

function grabImages(importPath: string, name: string) {
  // Check for the images
  // Send the image snapshots up the client.
  const splitPath = importPath.split("/");
  splitPath.pop();
  const folderPath = splitPath.join("/");

  const filename = importPath.split("/").pop()!.replace(".tsx", "");

  const finalPath = `${folderPath}/(snap)/${filename}/${name}`;

  const files = getScreensInFolder(finalPath)
    .sort()
    .reverse()
    .reduce((acc, current) => {
      const name = current.filename.replace(".actual", "");
      const isActual = current.filename.includes(".actual");
      if (!isActual && acc[name]) return acc;

      if (isActual) acc[name].actual = current.base64;
      else acc[name] = { ...current };

      return acc;
    }, {} as any);

  return Object.values(files) as any;
}

export const experimental_serverChannel = async (channel: Channel) => {
  channel.on(SVVR_INIT_REQ, async (ev: SVVR_INIT_REQ_EVENT) => {
    channel.emit(SVVR_INIT_RES, {
      screenshots: grabImages(ev.importPath, ev.name),
    } satisfies SVVR_INIT_RES_EVENT);
  });

  channel.on(SVVR_RERUN, async (ev: SVVR_RERUN_EVENT) => {
    channel.emit(SVVR_RERUN_LOADING, {});

    try {
      const args = ["run", ev.importPath, "-t", ev.name];
      await $({ cwd: process.cwd(), stdio: "inherit" })`op test ${args}`;
    } catch (e: any) {
      console.error(e.message);
    }

    channel.emit(SVVR_RERUN_DONE, {
      screenshots: grabImages(ev.importPath, ev.name),
    } satisfies SVVR_INIT_RES_EVENT);
  });

  channel.on(SVVR_UPDATE, async (ev: SVVR_RERUN_EVENT) => {
    channel.emit(SVVR_RERUN_LOADING, {});

    try {
      const args = ["run", ev.importPath, "-t", ev.name, "-u"];
      await $({ cwd: process.cwd(), stdio: "inherit" })`op test ${args}`;
    } catch (e: any) {
      console.error(e.message);
    }

    channel.emit(SVVR_RERUN_DONE, {
      screenshots: grabImages(ev.importPath, ev.name),
    } satisfies SVVR_INIT_RES_EVENT);
  });

  return channel;
};
