import type { Plugin } from "../plugin.js";
import { stringsPlugin } from "./strings.js";
import { booleansPlugin } from "./booleans.js";
import { comparisonPlugin } from "./comparison.js";
import { logicalPlugin } from "./logical.js";
import { ternaryPlugin } from "./ternary.js";
import { pipePlugin } from "./pipe.js";
import { membershipPlugin } from "./membership.js";
import { accessPlugin } from "./access.js";
import { arrowsPlugin } from "./arrows.js";
import { collectionsPlugin } from "./collections.js";
import { quotedIdentifierPlugin } from "./quoted-identifier.js";

export const standardPlugins: Plugin[] = [
  arrowsPlugin,
  collectionsPlugin,
  stringsPlugin,
  booleansPlugin,
  comparisonPlugin,
  logicalPlugin,
  membershipPlugin,
  ternaryPlugin,
  pipePlugin,
  accessPlugin,
  quotedIdentifierPlugin,
];

export {
  stringsPlugin,
  booleansPlugin,
  comparisonPlugin,
  logicalPlugin,
  ternaryPlugin,
  pipePlugin,
  membershipPlugin,
  accessPlugin,
  arrowsPlugin,
  collectionsPlugin,
  quotedIdentifierPlugin,
};
