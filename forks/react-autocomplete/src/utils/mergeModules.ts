// @ts-nocheck
/* eslint-disable */

import { mergeObjects } from './mergeObjects';

const mergeModules =
  (...modules) =>
  (cx) =>
    modules.reduce((accu, curr) => mergeObjects(accu, curr(cx)), {});

export { mergeModules };
