export { Evaluator } from "./evaluator/evaluate.js";
export type { Plugin, EvalFn } from "./plugin.js";
export type { Token } from "./lexer/types.js";

export {
  accessPlugin,
  arrowsPlugin,
  booleansPlugin,
  collectionsPlugin,
  comparisonPlugin,
  logicalPlugin,
  membershipPlugin,
  pipePlugin,
  standardPlugins,
  stringsPlugin,
  ternaryPlugin,
  quotedIdentifierPlugin,
} from "./plugins/standard.js";

export { createResolvedIdentifierPlugin } from "./plugins/resolved-identifier.js";
export { dateLiteralPlugin } from "./plugins/date-literal.js";
export { createDateIdentifierPlugin } from "./plugins/date-identifier.js";
