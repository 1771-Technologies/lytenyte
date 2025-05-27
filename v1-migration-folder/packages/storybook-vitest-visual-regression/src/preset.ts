import { SVVR_INIT_REQ, SVVR_INIT_RES } from "./+constants.ts";

import type Channel from "storybook/internal/channels";
import type { SVVR_INIT_REQ_EVENT, SVVR_INIT_RES_EVENT } from "./+types.js";
import { getScreensInFolder } from "./utils/get-screens-in-folder.ts";

export const experimental_serverChannel = async (channel: Channel) => {
  channel.on(SVVR_INIT_REQ, async (ev: SVVR_INIT_REQ_EVENT) => {
    // Check for the images
    // Send the image snapshots up the client.
    const splitPath = ev.importPath.split("/");
    const fileName = splitPath.pop()!.split(".").slice(0, -2).join(".");
    const folderPath = splitPath.join("/");

    const finalPath = `${folderPath}/__vr__/${fileName}/${ev.id}`;

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

    channel.emit(SVVR_INIT_RES, {
      screenshots: Object.values(files),
    } satisfies SVVR_INIT_RES_EVENT);
  });

  return channel;
};
