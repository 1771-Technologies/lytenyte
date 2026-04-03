import type { ASTNode } from "../parser/types.js";
import { optimize } from "./optimize.js";
import type { Plugin } from "../plugin.js";

export function compile(ast: ASTNode, plugins?: Plugin[]): ASTNode {
  return optimize(ast, plugins);
}
