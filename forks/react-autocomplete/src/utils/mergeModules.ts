// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { mergeObjects } from "./mergeObjects";

const mergeModules =
  (...modules) =>
  (cx) =>
    modules.reduce((accu, curr) => mergeObjects(accu, curr(cx)), {});

export { mergeModules };
