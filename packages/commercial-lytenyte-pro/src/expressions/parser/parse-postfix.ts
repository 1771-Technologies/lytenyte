import type { ASTNode } from "./types.js";
import type { ParserContext } from "./parser-context.js";
import { parsePrimary } from "./parse-primary.js";

export function parsePostfix(ctx: ParserContext): ASTNode {
  let node = parsePrimary(ctx);

  while (true) {
    if (ctx.plugins) {
      let handled = false;
      for (const plugin of ctx.plugins) {
        if (plugin.parsePostfix) {
          const result = plugin.parsePostfix(ctx, node);
          if (result) {
            node = result;
            handled = true;
            break;
          }
        }
      }
      if (handled) continue;
    }

    break;
  }

  return node;
}
