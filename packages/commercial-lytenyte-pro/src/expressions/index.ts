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
} from "./plugins/standard.js";
