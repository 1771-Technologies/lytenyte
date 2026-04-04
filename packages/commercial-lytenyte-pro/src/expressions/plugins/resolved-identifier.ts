import type { Plugin } from "../plugin.js";

export function createResolvedIdentifierPlugin(options: {
  identifiers: string[];
  args: string[];
}): Plugin {
  const identifierSet = new Set(options.identifiers);
  const argKeys = options.args;

  return {
    name: "resolved-identifier",
    evaluate: (node, context) => {
      if (node.type !== "Identifier") return null;
      if (!identifierSet.has(node.name)) return null;

      const fn = context[node.name];
      if (typeof fn !== "function") {
        throw new Error(`Resolved identifier "${node.name}" is not a function in context`);
      }

      const args = argKeys.map((key) => context[key]);
      return { value: fn(...args) };
    },
  };
}
